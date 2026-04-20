import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance, preHandlerHookHandler } from "fastify";
import { catalogConfig } from "../shared/config.js";

const genericObjectSchema = {
  type: "object",
  additionalProperties: true,
} as const;

const genericArraySchema = {
  type: "array",
  items: genericObjectSchema,
} as const;

const errorResponseSchema = {
  type: "object",
  properties: {
    error: { type: "string" },
    bucket: { type: "string" },
    requiredScopes: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["error"],
} as const;

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
} as const;

const slugParamSchema = {
  type: "object",
  properties: {
    slug: { type: "string" },
  },
  required: ["slug"],
} as const;

const internalDescription =
  "Private endpoint. Requires `Authorization: Bearer <token>` plus signed request headers: `x-catalog-timestamp`, `x-catalog-nonce`, and `x-catalog-signature`.";

export async function registerCatalogSwagger(app: FastifyInstance) {
  if (!catalogConfig.docs.enabled) return;
  await registerSwaggerInternal(app);
}

export async function registerSwaggerInternal(
  app: FastifyInstance,
  options?: { docsPreHandler?: preHandlerHookHandler },
) {
  const docsBaseUrl = `http://${catalogConfig.bindHost}:${catalogConfig.port}`;

  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "Zip Upload Buddy Catalog API",
        description:
          "Swagger documentation for the public catalog API and the private internal catalog operations.",
        version: "1.0.0",
      },
      servers: [
        {
          url: docsBaseUrl,
          description: "Local runtime",
        },
      ],
      tags: [
        {
          name: "System",
          description: "Health and operational endpoints.",
        },
        {
          name: "Public",
          description: "Public catalog endpoints consumed by the site.",
        },
        {
          name: "Internal",
          description: internalDescription,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "Token",
            description:
              "Service token for `/internal/*` routes. Signed headers are also required on every request.",
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      persistAuthorization: true,
    },
    uiHooks: options?.docsPreHandler
      ? {
          preHandler: options.docsPreHandler,
        }
      : undefined,
    staticCSP: true,
    transformSpecificationClone: true,
  });
}

function withErrorResponses<T extends Record<string, unknown>>(schema: T): T & {
  response: Record<string | number, unknown>;
} {
  return {
    ...schema,
    response: {
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      409: errorResponseSchema,
      429: errorResponseSchema,
      ...((schema.response as Record<string, unknown> | undefined) ?? {}),
    },
  } as T & {
    response: Record<string | number, unknown>;
  };
}

function internalRouteSchema<T extends Record<string, unknown>>(schema: T): T & Record<string, unknown> {
  return withErrorResponses({
    security: [{ bearerAuth: [] }],
    description: internalDescription,
    ...schema,
  }) as T & Record<string, unknown>;
}

export const catalogRouteSchemas = {
  healthz: {
    tags: ["System"],
    summary: "API health check",
    response: {
      200: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
        },
        required: ["ok"],
      },
    },
  },
  publicHealthz: {
    tags: ["System"],
    summary: "Public API health check",
    response: {
      200: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
        },
        required: ["ok"],
      },
    },
  },
  publicBootstrap: {
    tags: ["Public"],
    summary: "Get catalog bootstrap payload",
    response: {
      200: genericObjectSchema,
    },
  },
  publicCatalogProducts: {
    tags: ["Public"],
    summary: "List catalog products",
    querystring: {
      type: "object",
      properties: {
        limit: { type: "string" },
        offset: { type: "string" },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  },
  publicCities: {
    tags: ["Public"],
    summary: "List cities",
    response: {
      200: genericArraySchema,
    },
  },
  publicCityDetail: withErrorResponses({
    tags: ["Public"],
    summary: "Get city detail",
    params: slugParamSchema,
    response: {
      200: genericObjectSchema,
    },
  }),
  publicStoreDetail: withErrorResponses({
    tags: ["Public"],
    summary: "Get public store detail",
    params: idParamSchema,
    response: {
      200: genericObjectSchema,
    },
  }),
  publicProductsByIds: {
    tags: ["Public"],
    summary: "Get products by IDs",
    description: "Pass one or more `id` query values. Repeating `?id=...` is supported.",
    querystring: {
      type: "object",
      properties: {
        id: {
          anyOf: [
            { type: "string" },
            {
              type: "array",
              items: { type: "string" },
            },
          ],
        },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  },
  publicProductDetail: withErrorResponses({
    tags: ["Public"],
    summary: "Get unified product detail",
    params: idParamSchema,
    response: {
      200: genericObjectSchema,
    },
  }),
  publicProductOffers: withErrorResponses({
    tags: ["Public"],
    summary: "List product offers",
    params: idParamSchema,
    response: {
      200: genericArraySchema,
    },
  }),
  publicBrandDetail: withErrorResponses({
    tags: ["Public"],
    summary: "Get brand detail",
    params: slugParamSchema,
    response: {
      200: genericObjectSchema,
    },
  }),
  publicSearch: {
    tags: ["Public"],
    summary: "Search the public catalog",
    querystring: {
      type: "object",
      properties: {
        q: { type: "string" },
        brands: { type: "string", description: "Comma-separated brand list." },
        categories: { type: "string", description: "Comma-separated category list." },
        stores: { type: "string", description: "Comma-separated store IDs." },
        cities: { type: "string", description: "Comma-separated city labels." },
        priceMin: { type: "string" },
        priceMax: { type: "string" },
        inStockOnly: { type: "string", enum: ["true", "false"] },
        onSaleOnly: { type: "string", enum: ["true", "false"] },
        verifiedOnly: { type: "string", enum: ["true", "false"] },
        officialDealerOnly: { type: "string", enum: ["true", "false"] },
        sort: {
          type: "string",
          enum: ["relevance", "price_asc", "price_desc", "rating_desc", "freshness_desc", "offers_desc"],
        },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  },
  internalStores: internalRouteSchema({
    tags: ["Internal"],
    summary: "List internal stores",
    querystring: {
      type: "object",
      properties: {
        limit: { type: "string" },
        offset: { type: "string" },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  }),
  internalStoreDetail: internalRouteSchema({
    tags: ["Internal"],
    summary: "Get internal store detail",
    params: idParamSchema,
    response: {
      200: genericObjectSchema,
    },
  }),
  internalStoreSize: internalRouteSchema({
    tags: ["Internal"],
    summary: "Get store size summary",
    params: idParamSchema,
    response: {
      200: genericObjectSchema,
    },
  }),
  internalProbe: internalRouteSchema({
    tags: ["Internal"],
    summary: "Enqueue store probe",
    params: idParamSchema,
    response: {
      202: genericObjectSchema,
    },
  }),
  internalSync: internalRouteSchema({
    tags: ["Internal"],
    summary: "Enqueue store sync",
    params: idParamSchema,
    response: {
      202: genericObjectSchema,
    },
  }),
  internalDiscoveryRescan: internalRouteSchema({
    tags: ["Internal"],
    summary: "Enqueue discovery rescan",
    response: {
      202: genericObjectSchema,
    },
  }),
  internalCatalogRefresh: internalRouteSchema({
    tags: ["Internal"],
    summary: "Run catalog refresh",
    body: {
      type: "object",
      properties: {
        limit: { type: "integer" },
        includeDiscovery: { type: "boolean" },
        officialOnly: { type: "boolean" },
        dedupeByDomain: { type: "boolean" },
        concurrency: { type: "integer" },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  }),
  internalCatalogRetryFailed: internalRouteSchema({
    tags: ["Internal"],
    summary: "Retry failed catalog stores",
    body: {
      type: "object",
      properties: {
        includeZeroProducts: { type: "boolean" },
        limit: { type: "integer" },
        concurrency: { type: "integer" },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  }),
  internalCoverageSummary: internalRouteSchema({
    tags: ["Internal"],
    summary: "Get coverage summary",
    response: {
      200: genericObjectSchema,
    },
  }),
  internalDomainsBacklog: internalRouteSchema({
    tags: ["Internal"],
    summary: "List domain backlog",
    response: {
      200: genericArraySchema,
    },
  }),
  internalDomainEvidence: internalRouteSchema({
    tags: ["Internal"],
    summary: "Get domain evidence",
    params: idParamSchema,
    response: {
      200: genericObjectSchema,
    },
  }),
  internalDomainSession: internalRouteSchema({
    tags: ["Internal"],
    summary: "Register a session for a domain",
    params: idParamSchema,
    body: {
      type: "object",
      properties: {
        cookiesJson: { type: "string" },
        headers: {
          type: "object",
          additionalProperties: { type: "string" },
        },
        notes: { type: "string" },
        expiresAt: { type: "string", format: "date-time" },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  }),
  internalDomainFeedSync: internalRouteSchema({
    tags: ["Internal"],
    summary: "Save and sync a partner feed",
    params: idParamSchema,
    body: {
      type: "object",
      properties: {
        sourceUrl: { type: "string", format: "uri" },
        authHeaders: {
          type: "object",
          additionalProperties: { type: "string" },
        },
        fieldMap: {
          type: "object",
          additionalProperties: { type: "string" },
        },
      },
      required: ["sourceUrl"],
    },
    response: {
      200: genericObjectSchema,
    },
  }),
  internalSearch: internalRouteSchema({
    tags: ["Internal"],
    summary: "Search the internal catalog index",
    querystring: {
      type: "object",
      properties: {
        q: { type: "string" },
        storeId: { type: "string" },
        minPrice: { type: "string" },
        maxPrice: { type: "string" },
        onSale: { type: "string", enum: ["true", "false"] },
        availability: { type: "string" },
        limit: { type: "string" },
      },
    },
    response: {
      200: genericObjectSchema,
    },
  }),
} as const;
