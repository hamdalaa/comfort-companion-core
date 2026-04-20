import { describe, expect, it } from "vitest";
import type { CatalogContext } from "../shared/bootstrap.js";
import { buildPublicUnifiedSearch } from "../api/publicCatalog.js";
import { buildSearchDocument } from "../shared/catalog/searchDocuments.js";
import { nowIso, compactText } from "../shared/catalog/normalization.js";
import type { CatalogProductDraft, StoreRecord } from "../shared/catalog/types.js";
import { MemoryCatalogRepository } from "../shared/repositories/memoryCatalogRepository.js";
import { MemorySearchEngine } from "../shared/search/memorySearchEngine.js";

function makeStore(id: string, name: string, category: string): StoreRecord {
  const timestamp = nowIso();
  return {
    id,
    name,
    normalizedName: compactText(name),
    slug: compactText(name),
    discoverySource: "manual_seed",
    status: "indexed",
    createdAt: timestamp,
    updatedAt: timestamp,
    website: `https://${id}.example.com`,
    websiteType: "official",
    area: "شارع الصناعة",
    primaryCategory: category,
  };
}

function makeProduct(input: {
  storeId: string;
  sourceProductId: string;
  title: string;
  brand?: string;
  model?: string;
  categoryPath: string[];
  price: number;
}): CatalogProductDraft {
  const timestamp = nowIso();
  return {
    storeId: input.storeId,
    sourceProductId: input.sourceProductId,
    normalizedTitle: compactText(input.title),
    title: input.title,
    brand: input.brand,
    model: input.model,
    sku: input.sourceProductId.toUpperCase(),
    categoryPath: input.categoryPath,
    sourceUrl: `https://${input.storeId}.example.com/p/${input.sourceProductId}`,
    availability: "in_stock",
    currency: "IQD",
    livePrice: input.price,
    onSale: false,
    sourceConnector: "shopify",
    freshnessAt: timestamp,
    lastSeenAt: timestamp,
    brandTokens: input.brand ? [input.brand.toLowerCase()] : [],
    modelTokens: input.model ? [input.model.toLowerCase()] : [],
    skuTokens: [input.sourceProductId.toLowerCase()],
    rawPayload: {},
  };
}

describe("search relevance", () => {
  it("keeps direct mac matches ahead of unrelated partial substrings", async () => {
    const repository = new MemoryCatalogRepository();
    const searchEngine = new MemorySearchEngine();

    const stores = [
      makeStore("apple-house", "Apple House", "Computing"),
      makeStore("pc-hub", "PC Hub", "Accessories"),
      makeStore("apple-corner", "Apple Corner", "Smart Devices"),
    ];

    const products = [
      makeProduct({
        storeId: "apple-house",
        sourceProductId: "macbook-air-m3",
        title: "MacBook Air M3",
        brand: "Apple",
        model: "M3",
        categoryPath: ["Computing", "Laptops"],
        price: 1_450_000,
      }),
      makeProduct({
        storeId: "pc-hub",
        sourceProductId: "machine-mouse",
        title: "Machine Gaming Mouse",
        brand: "Generic",
        categoryPath: ["Accessories", "Mouse"],
        price: 45_000,
      }),
      makeProduct({
        storeId: "apple-corner",
        sourceProductId: "watch-series-10",
        title: "Apple Watch Series 10",
        brand: "Apple",
        categoryPath: ["Wearables", "Smartwatch"],
        price: 520_000,
      }),
    ];

    for (const store of stores) {
      await repository.upsertStore(store);
      const storeProducts = products.filter((product) => product.storeId === store.id);
      await repository.replaceCatalogSnapshot(store.id, storeProducts, [], []);
      await searchEngine.replaceStoreDocuments(store.id, storeProducts.map((product) => buildSearchDocument(store, product)));
    }

    const searchResult = await searchEngine.search({ q: "mac", limit: 10 });
    expect(searchResult.hits[0]?.title).toBe("MacBook Air M3");

    const publicResult = await buildPublicUnifiedSearch(
      { repository, searchEngine } as unknown as CatalogContext,
      { q: "mac", sort: "relevance" },
    );
    expect(publicResult.products[0]?.title).toBe("MacBook Air M3");
  });
});
