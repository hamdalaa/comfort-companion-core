import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import type { CatalogContext } from "../shared/bootstrap.js";
import { createCatalogContext } from "../shared/bootstrap.js";
import { catalogConfig } from "../shared/config.js";
import { createRedisConnection, BullCatalogJobQueue, type CatalogJobQueue } from "../worker/queues.js";
import { TokenRateLimiter } from "../shared/security/rateLimiter.js";
import { createInternalAuth, requireCatalogScopes } from "./auth.js";
import { CatalogRefreshService } from "../shared/services/catalogRefreshService.js";
import { catalogRouteSchemas, registerSwaggerInternal } from "./swagger.js";
import {
  buildPublicBootstrap,
  buildPublicCatalogProducts,
  buildPublicBrandDetail,
  buildPublicProductDetail,
  buildPublicProductOffers,
  buildPublicProductsByIds,
  buildPublicStoreDetail,
  buildPublicUnifiedSearch,
  getPublicCity,
  listPublicCities,
} from "./publicCatalog.js";

export async function createCatalogApiServer(
  providedContext?: CatalogContext,
  providedQueue?: CatalogJobQueue,
) {
  const context = providedContext ?? (await createCatalogContext());
  await context.discoveryService.rescan("bootstrap");
  const queue =
    providedQueue ??
    new BullCatalogJobQueue(createRedisConnection());
  const auth = createInternalAuth(context.repository);
  const rateLimiter = new TokenRateLimiter();
  const refreshService = new CatalogRefreshService(
    context.repository,
    context.discoveryService,
    context.probeService,
    context.syncService,
    context.coverageService,
  );

  const app = Fastify({
    logger: true,
    bodyLimit: catalogConfig.api.bodyLimitBytes,
    routerOptions: {
      maxParamLength: 256,
    },
  });
  await app.register(rateLimit, {
    global: false,
    keyGenerator: (request) => request.ip,
  });
  const docsRateLimit = app.rateLimit({
    max: catalogConfig.docs.rateLimitMax,
    timeWindow: catalogConfig.publicRateLimit.windowMs,
  });
  if (catalogConfig.docs.enabled) {
    await registerSwaggerInternal(app, {
      docsPreHandler: docsRateLimit,
    });
  }
  const helmetStatics = helmet as unknown as {
    contentSecurityPolicy: {
      getDefaultDirectives(): Record<string, string[]>;
    };
  };
  await app.register(helmet, (instance) => ({
    contentSecurityPolicy: catalogConfig.docs.enabled
      ? {
          directives: {
            ...helmetStatics.contentSecurityPolicy.getDefaultDirectives(),
            "form-action": ["'self'"],
            "img-src": ["'self'", "data:", "validator.swagger.io"],
            "script-src": ["'self'"].concat(instance.swaggerCSP.script),
            "style-src": ["'self'", "https:"].concat(instance.swaggerCSP.style),
          },
        }
      : undefined,
  }));
  const publicReadRateLimit = app.rateLimit({
    max: catalogConfig.publicRateLimit.max,
    timeWindow: catalogConfig.publicRateLimit.windowMs,
  });
  const publicSearchRateLimit = app.rateLimit({
    max: catalogConfig.publicRateLimit.searchMax,
    timeWindow: catalogConfig.publicRateLimit.windowMs,
  });
  const publicResponseCache = new Map<
    string,
    { expiresAt: number; resolved: boolean; value: unknown; pending?: Promise<unknown> }
  >();

  const getPublicCacheControl = (url: string) => {
    if (/^\/public\/healthz(?:\?|$)/.test(url)) return "no-store";
    if (
      /^\/public\/bootstrap(?:\?|$)/.test(url) ||
      /^\/public\/search(?:\?|$)/.test(url) ||
      /^\/public\/catalog-products(?:\?|$)/.test(url) ||
      /^\/public\/products\/by-ids(?:\?|$)/.test(url) ||
      /^\/public\/products\/[^/]+\/offers(?:\?|$)/.test(url)
    ) {
      return "public, max-age=30, stale-while-revalidate=300";
    }
    if (
      /^\/public\/products\/[^/]+(?:\?|$)/.test(url) ||
      /^\/public\/stores\/[^/]+(?:\?|$)/.test(url) ||
      /^\/public\/brands\/[^/]+(?:\?|$)/.test(url)
    ) {
      return "public, max-age=300, stale-while-revalidate=900";
    }
    if (/^\/public\/cities(?:\/[^/]+)?(?:\?|$)/.test(url)) {
      return "public, max-age=3600, stale-while-revalidate=86400";
    }
    return "public, max-age=30, stale-while-revalidate=300";
  };

  app.addHook("onRequest", async (request, reply) => {
    const requestUrl = request.raw.url ?? request.url;
    if (requestUrl.length > catalogConfig.api.maxUrlLength) {
      reply.code(414).send({ error: "request_uri_too_large" });
      return reply;
    }
    return undefined;
  });

  app.addHook("onSend", async (request, reply, payload) => {
    if (request.url.startsWith("/internal")) {
      reply.header("cache-control", "no-store");
    } else if (request.url.startsWith("/public")) {
      reply.header("cache-control", getPublicCacheControl(request.url));
    } else if (request.url.startsWith("/docs")) {
      reply.header("cache-control", "no-store");
      reply.header("x-robots-tag", "noindex");
    }
    return payload;
  });

  app.get("/healthz", { schema: catalogRouteSchemas.healthz }, async () => ({ ok: true }));
  app.get("/public/healthz", { schema: catalogRouteSchemas.publicHealthz, preHandler: publicReadRateLimit }, async () => ({ ok: true }));
  app.get("/public/bootstrap", { schema: catalogRouteSchemas.publicBootstrap, preHandler: publicReadRateLimit }, async (request) =>
    getCachedPublicResponse(request.url, 30_000, () => buildPublicBootstrap(context)),
  );
  app.get<{
    Querystring: {
      limit?: string;
      offset?: string;
    };
  }>("/public/catalog-products", { schema: catalogRouteSchemas.publicCatalogProducts, preHandler: publicReadRateLimit }, async (request) =>
    getCachedPublicResponse(request.url, 30_000, () =>
      buildPublicCatalogProducts(context, {
        limit: request.query.limit ? Number(request.query.limit) : undefined,
        offset: request.query.offset ? Number(request.query.offset) : undefined,
      }),
    ),
  );
  app.get("/public/cities", { schema: catalogRouteSchemas.publicCities, preHandler: publicReadRateLimit }, async (request) =>
    getCachedPublicResponse(request.url, 60 * 60_000, () => listPublicCities()),
  );

  app.get<{ Params: { slug: string } }>("/public/cities/:slug", { schema: catalogRouteSchemas.publicCityDetail, preHandler: publicReadRateLimit }, async (request, reply) => {
    const city = await getCachedPublicResponse(request.url, 60 * 60_000, () => getPublicCity(request.params.slug));
    if (!city) {
      reply.code(404).send({ error: "city_not_found" });
      return;
    }
    return city;
  });

  app.get<{ Params: { id: string } }>("/public/stores/:id", { schema: catalogRouteSchemas.publicStoreDetail, preHandler: publicReadRateLimit }, async (request, reply) => {
    const detail = await getCachedPublicResponse(request.url, 5 * 60_000, () => buildPublicStoreDetail(context, request.params.id));
    if (!detail) {
      reply.code(404).send({ error: "store_not_found" });
      return;
    }
    return detail;
  });

  app.get<{
    Querystring: {
      id?: string | string[];
    };
  }>("/public/products/by-ids", { schema: catalogRouteSchemas.publicProductsByIds, preHandler: publicReadRateLimit }, async (request) => {
    const ids = Array.isArray(request.query.id)
      ? request.query.id
      : request.query.id
        ? [request.query.id]
        : [];

    return getCachedPublicResponse(request.url, 30_000, async () => ({
      items: await buildPublicProductsByIds(context, ids),
    }));
  });

  app.get<{ Params: { id: string } }>("/public/products/:id", { schema: catalogRouteSchemas.publicProductDetail, preHandler: publicReadRateLimit }, async (request, reply) => {
    const product = await getCachedPublicResponse(request.url, 5 * 60_000, () => buildPublicProductDetail(context, request.params.id));
    if (!product) {
      reply.code(404).send({ error: "product_not_found" });
      return;
    }
    return product;
  });

  app.get<{ Params: { id: string } }>("/public/products/:id/offers", { schema: catalogRouteSchemas.publicProductOffers, preHandler: publicReadRateLimit }, async (request, reply) => {
    const offers = await getCachedPublicResponse(request.url, 30_000, () => buildPublicProductOffers(context, request.params.id));
    if (offers.length === 0) {
      const product = await buildPublicProductDetail(context, request.params.id);
      if (!product) {
        reply.code(404).send({ error: "product_not_found" });
        return;
      }
    }
    return offers;
  });

  app.get<{ Params: { slug: string } }>("/public/brands/:slug", { schema: catalogRouteSchemas.publicBrandDetail, preHandler: publicReadRateLimit }, async (request, reply) => {
    const brand = await getCachedPublicResponse(request.url, 5 * 60_000, () => buildPublicBrandDetail(context, request.params.slug));
    if (!brand) {
      reply.code(404).send({ error: "brand_not_found" });
      return;
    }
    return brand;
  });

  app.get<{
    Querystring: {
      q?: string;
      brands?: string | string[];
      categories?: string | string[];
      stores?: string | string[];
      cities?: string | string[];
      priceMin?: string;
      priceMax?: string;
      inStockOnly?: string;
      onSaleOnly?: string;
      verifiedOnly?: string;
      officialDealerOnly?: string;
      sort?: "relevance" | "price_asc" | "price_desc" | "rating_desc" | "freshness_desc" | "offers_desc";
    };
  }>("/public/search", { schema: catalogRouteSchemas.publicSearch, preHandler: publicSearchRateLimit }, async (request) => {
    const asList = (value?: string | string[]) =>
      Array.isArray(value)
        ? value.flatMap((entry) => entry.split(",")).map((entry) => entry.trim()).filter(Boolean)
        : value
          ? value.split(",").map((entry) => entry.trim()).filter(Boolean)
          : undefined;

    return getCachedPublicResponse(request.url, 30_000, () =>
      buildPublicUnifiedSearch(context, {
        q: request.query.q,
        brands: asList(request.query.brands),
        categories: asList(request.query.categories),
        stores: asList(request.query.stores),
        cities: asList(request.query.cities),
        priceMin: request.query.priceMin ? Number(request.query.priceMin) : undefined,
        priceMax: request.query.priceMax ? Number(request.query.priceMax) : undefined,
        inStockOnly: request.query.inStockOnly === "true",
        onSaleOnly: request.query.onSaleOnly === "true",
        verifiedOnly: request.query.verifiedOnly === "true",
        officialDealerOnly: request.query.officialDealerOnly === "true",
        sort: request.query.sort,
      }),
    );
  });

  app.addHook("preHandler", async (request, reply) => {
    if (!request.url.startsWith("/internal")) return;
    await auth(request, reply);
    if (reply.sent) return reply;
  });

  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit({
        max: 20,
        timeWindow: catalogConfig.publicRateLimit.windowMs,
      }),
    },
    async (_request, reply) => {
      reply.code(404).send({ error: "not_found" });
    },
  );

  app.get<{
    Querystring: {
      limit?: string;
      offset?: string;
    };
  }>("/internal/stores", { schema: catalogRouteSchemas.internalStores }, async (request, reply) => {
    if (!guard(request, reply, ["catalog.read"], "stores:list", 20, 60_000)) return;
    const stores = await context.repository.listStores();
    const sizeSummaries = await context.repository.listStoreSizeSummaries();
    const sizeByStoreId = new Map(sizeSummaries.map((summary) => [summary.storeId, summary]));
    const limit = clampLimit(request.query.limit, 100, 200);
    const offset = Math.max(0, Number(request.query.offset ?? "0") || 0);
    const pagedStores = stores.slice(offset, offset + limit);
    return {
      total: stores.length,
      limit,
      offset,
      items: await Promise.all(
        pagedStores.map(async (store) => ({
          store,
          connectorProfile: await context.repository.getConnectorProfile(store.id),
          size: sizeByStoreId.get(store.id),
        })),
      ),
    };
  });

  app.get<{ Params: { id: string } }>("/internal/stores/:id", { schema: catalogRouteSchemas.internalStoreDetail }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.read"])) return;
    if (!consumeRate(request, "stores:get", 60, 60_000, reply)) return;
    const store = await context.repository.getStoreById(request.params.id);
    if (!store) {
      reply.code(404).send({ error: "store_not_found" });
      return;
    }
    return {
      store,
      connectorProfile: await context.repository.getConnectorProfile(store.id),
      size: await context.repository.getStoreSizeSummary(store.id),
    };
  });

  app.get<{ Params: { id: string } }>("/internal/stores/:id/size", { schema: catalogRouteSchemas.internalStoreSize }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.read"])) return;
    if (!consumeRate(request, "stores:size", 60, 60_000, reply)) return;
    const size = await context.repository.getStoreSizeSummary(request.params.id);
    if (!size) {
      reply.code(404).send({ error: "size_not_found" });
      return;
    }
    return size;
  });

  app.post<{ Params: { id: string } }>("/internal/stores/:id/probe", { schema: catalogRouteSchemas.internalProbe }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.queue"])) return;
    if (!consumeRate(request, "queue:probe", 10, 60_000, reply)) return;
    await queue.enqueueProbe({ storeId: request.params.id, actor: "api" });
    reply.code(202).send({ enqueued: true, queue: "probe", storeId: request.params.id });
  });

  app.post<{ Params: { id: string } }>("/internal/stores/:id/sync", { schema: catalogRouteSchemas.internalSync }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.queue"])) return;
    if (!consumeRate(request, "queue:sync", 10, 60_000, reply)) return;
    await queue.enqueueSync({ storeId: request.params.id, actor: "api" });
    reply.code(202).send({ enqueued: true, queue: "sync", storeId: request.params.id });
  });

  app.post("/internal/discovery/rescan", { schema: catalogRouteSchemas.internalDiscoveryRescan }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.queue"])) return;
    if (!consumeRate(request, "queue:discovery", 2, 60_000, reply)) return;
    await queue.enqueueDiscoveryRescan({ actor: "api" });
    reply.code(202).send({ enqueued: true, queue: "discovery" });
  });

  app.post<{
    Body: {
      limit?: number;
      includeDiscovery?: boolean;
      officialOnly?: boolean;
      dedupeByDomain?: boolean;
      concurrency?: number;
    };
  }>("/internal/catalog/refresh", { schema: catalogRouteSchemas.internalCatalogRefresh }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.queue"])) return;
    if (!consumeRate(request, "catalog:refresh", 1, 10 * 60_000, reply)) return;
    const result = await refreshService.refresh({
      actor: "api",
      includeDiscovery: request.body?.includeDiscovery ?? true,
      officialOnly: request.body?.officialOnly ?? true,
      dedupeByDomain: request.body?.dedupeByDomain ?? true,
      limit: request.body?.limit,
      concurrency: request.body?.concurrency,
    });
    clearPublicResponseCache();
    reply.code(200).send(result);
  });

  app.post<{
    Body: {
      includeZeroProducts?: boolean;
      limit?: number;
      concurrency?: number;
    };
  }>("/internal/catalog/retry-failed", { schema: catalogRouteSchemas.internalCatalogRetryFailed }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.queue"])) return;
    if (!consumeRate(request, "catalog:retry-failed", 1, 10 * 60_000, reply)) return;
    const candidateIds = await context.coverageService.getRetryCandidateStoreIds(
      request.body?.includeZeroProducts ?? true,
    );
    const selectedIds = request.body?.limit ? candidateIds.slice(0, request.body.limit) : candidateIds;
    const result = await refreshService.refresh({
      actor: "api",
      includeDiscovery: false,
      officialOnly: true,
      dedupeByDomain: false,
      concurrency: request.body?.concurrency ?? 4,
      storeIds: selectedIds,
    });
    reply.code(200).send(result);
  });

  app.get("/internal/coverage/summary", { schema: catalogRouteSchemas.internalCoverageSummary }, async (request, reply) => {
    if (!guard(request, reply, ["catalog.read"], "coverage:summary", 60, 60_000)) return;
    return context.coverageService.summarizeCoverage();
  });

  app.get("/internal/domains/backlog", { schema: catalogRouteSchemas.internalDomainsBacklog }, async (request, reply) => {
    if (!guard(request, reply, ["catalog.read"], "domains:backlog", 60, 60_000)) return;
    return context.coverageService.listBacklog();
  });

  app.get<{ Params: { id: string } }>("/internal/domains/:id/evidence", { schema: catalogRouteSchemas.internalDomainEvidence }, async (request, reply) => {
    if (!guard(request, reply, ["catalog.read"], "domains:evidence", 60, 60_000)) return;
    try {
      return await context.coverageService.getDomainEvidence(request.params.id);
    } catch {
      reply.code(404).send({ error: "store_not_found" });
    }
  });

  app.post<{
    Params: { id: string };
    Body: {
      cookiesJson?: string;
      headers?: Record<string, string>;
      notes?: string;
      expiresAt?: string;
    };
  }>("/internal/domains/:id/session", { schema: catalogRouteSchemas.internalDomainSession }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.session"])) return;
    if (!consumeRate(request, "domains:session", 20, 60_000, reply)) return;
    const session = await context.coverageService.registerSession(request.params.id, {
      cookiesJson: request.body?.cookiesJson,
      headers: request.body?.headers,
      notes: request.body?.notes,
      expiresAt: request.body?.expiresAt,
    });
    reply.code(200).send(session);
  });

  app.post<{
    Params: { id: string };
    Body: {
      sourceUrl: string;
      authHeaders?: Record<string, string>;
      fieldMap?: Record<string, string>;
    };
  }>("/internal/domains/:id/feed-sync", { schema: catalogRouteSchemas.internalDomainFeedSync }, async (request, reply) => {
    if (!requireCatalogScopes(request, reply, ["catalog.feed"])) return;
    if (!consumeRate(request, "domains:feed-sync", 10, 60_000, reply)) return;
    const feed = await context.feedSyncService.saveAndSync(
      request.params.id,
      {
        sourceUrl: request.body.sourceUrl,
        authHeaders: request.body.authHeaders,
        fieldMap: request.body.fieldMap,
      },
      "api",
    );
    clearPublicResponseCache();
    reply.code(200).send(feed);
  });

  app.get<{
    Querystring: {
      q?: string;
      storeId?: string;
      minPrice?: string;
      maxPrice?: string;
      onSale?: string;
      availability?: string;
      limit?: string;
    };
  }>("/internal/search", { schema: catalogRouteSchemas.internalSearch }, async (request, reply) => {
    if (!guard(request, reply, ["catalog.read"], "search", 120, 60_000)) return;
    return context.searchEngine.search({
      q: request.query.q ?? "",
      ...(request.query.storeId ? { storeId: request.query.storeId } : {}),
      ...(request.query.minPrice ? { minPrice: Number(request.query.minPrice) } : {}),
      ...(request.query.maxPrice ? { maxPrice: Number(request.query.maxPrice) } : {}),
      ...(request.query.onSale ? { onSale: request.query.onSale === "true" } : {}),
      ...(request.query.availability ? { availability: request.query.availability } : {}),
      limit: clampLimit(request.query.limit, 20, 100),
    });
  });

  function consumeRate(
    request: FastifyRequest,
    bucket: string,
    max: number,
    windowMs: number,
    reply: FastifyReply,
  ): boolean {
    const tokenName = request.catalogToken?.name;
    if (!tokenName) {
      reply.code(401).send({ error: "missing_authenticated_token_context" });
      return false;
    }
    const accepted = rateLimiter.consume(`${tokenName}:${bucket}`, max, windowMs);
    if (!accepted) {
      reply.code(429).send({ error: "rate_limit_exceeded", bucket });
      return false;
    }
    return true;
  }

  function guard(
    request: FastifyRequest,
    reply: FastifyReply,
    requiredScopes: string[],
    bucket: string,
    max: number,
    windowMs: number,
  ): boolean {
    if (!requireCatalogScopes(request, reply, requiredScopes)) return false;
    return consumeRate(request, bucket, max, windowMs, reply);
  }

  function clampLimit(raw: string | undefined, defaultValue: number, maxValue: number): number {
    const parsed = Number(raw ?? defaultValue);
    if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
    return Math.min(Math.floor(parsed), maxValue);
  }

  async function getCachedPublicResponse<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const cached = publicResponseCache.get(key);
    if (cached && cached.expiresAt > now && cached.resolved) {
      return cached.value as T;
    }
    if (cached?.pending) {
      return cached.pending as Promise<T>;
    }

    const pending = loader()
      .then((value) => {
        publicResponseCache.set(key, {
          expiresAt: Date.now() + ttlMs,
          resolved: true,
          value,
        });
        return value;
      })
      .catch((error) => {
        publicResponseCache.delete(key);
        throw error;
      });

    publicResponseCache.set(key, {
      expiresAt: now + ttlMs,
      resolved: false,
      value: undefined,
      pending,
    });
    return pending;
  }

  function clearPublicResponseCache() {
    publicResponseCache.clear();
  }

  return app;
}

if (
  process.argv[1] &&
  (process.argv[1].endsWith(`${process.platform === "win32" ? "\\" : "/"}api${process.platform === "win32" ? "\\" : "/"}server.ts`) ||
    process.argv[1].endsWith(`${process.platform === "win32" ? "\\" : "/"}api${process.platform === "win32" ? "\\" : "/"}server.js`))
) {
  const app = await createCatalogApiServer();
  await app.listen({
    port: catalogConfig.port,
    host: catalogConfig.bindHost,
  });
}
