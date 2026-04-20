import { DatabaseSync } from "node:sqlite";
import type { SearchDocument } from "../catalog/types.js";
import type { SearchQueryInput } from "../repositories/contracts.js";
import { ensureCatalogSqliteSchema, openCatalogSqlite } from "../db/sqliteSupport.js";
import type { SearchEngine, SearchResult } from "./contracts.js";
import { scoreSearchTextMatch } from "./relevance.js";

type DbRow = Record<string, unknown>;
type SqliteParam = string | number | bigint | Uint8Array | null;

function asOptionalString(value: unknown): string | undefined {
  return value == null ? undefined : String(value);
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function toSqliteParams(...values: unknown[]): SqliteParam[] {
  return values.map((value) => {
    if (value == null) return null;
    if (value instanceof Uint8Array) return value;
    if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") return value;
    return String(value);
  });
}

export class SqliteSearchEngine implements SearchEngine {
  private readonly db: DatabaseSync;

  constructor(databasePath: string) {
    this.db = openCatalogSqlite(databasePath);
  }

  async ensureReady(): Promise<void> {
    ensureCatalogSqliteSchema(this.db);
  }

  async replaceStoreDocuments(storeId: string, documents: SearchDocument[]): Promise<void> {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare("DELETE FROM search_documents WHERE store_id = ?").run(storeId);
      if (documents.length > 0) {
        const insert = this.db.prepare(
          `
          INSERT INTO search_documents (
            id, store_id, store_name, normalized_title, title, brand, model, sku, live_price, original_price,
            on_sale, availability, freshness_at, source_url, category_path, image_url, currency, offer_label, seller_name
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        );

        for (const document of documents) {
          insert.run(...toSqliteParams(
            document.id,
            document.storeId,
            document.storeName,
            document.normalizedTitle,
            document.title,
            document.brand,
            document.model,
            document.sku,
            document.livePrice,
            document.originalPrice,
            Number(document.onSale),
            document.availability,
            document.freshnessAt,
            document.sourceUrl,
            document.categoryPath,
            document.imageUrl,
            document.currency,
            document.offerLabel,
            document.sellerName,
          ));
        }
      }
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  async search(query: SearchQueryInput): Promise<SearchResult> {
    await this.ensureReady();
    const limit = Math.max(1, Math.min(query.limit ?? 20, 500));
    const { whereSql, params } = this.buildFilters(query);

    if (!query.q?.trim()) {
      const totalRow = this.db
        .prepare(`SELECT COUNT(*) AS count FROM search_documents ${whereSql}`)
        .get(...params) as DbRow | undefined;
      const rows = this.db
        .prepare(
          `
          SELECT *
          FROM search_documents
          ${whereSql}
          ORDER BY on_sale DESC, freshness_at DESC
          LIMIT ?
          `,
        )
        .all(...params, limit);

      return {
        total: asNumber(totalRow?.count) ?? 0,
        hits: rows.map((row) => this.mapRow(row as DbRow)),
      };
    }

    const rows = this.db.prepare(`SELECT * FROM search_documents ${whereSql}`).all(...params);
    const scored = rows
      .map((row) => this.mapRow(row as DbRow))
      .map((document) => ({
        document,
        score: scoreDocument(document, query.q ?? ""),
      }))
      .filter((entry) => entry.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          Number(b.document.onSale) - Number(a.document.onSale) ||
          b.document.freshnessAt.localeCompare(a.document.freshnessAt),
      );

    return {
      total: scored.length,
      hits: scored.slice(0, limit).map((entry) => entry.document),
    };
  }

  private buildFilters(query: SearchQueryInput): { whereSql: string; params: Array<string | number> } {
    const filters: string[] = [];
    const params: Array<string | number> = [];

    if (query.storeId) {
      filters.push("store_id = ?");
      params.push(query.storeId);
    }
    if (query.onSale != null) {
      filters.push("on_sale = ?");
      params.push(Number(query.onSale));
    }
    if (query.availability) {
      filters.push("availability = ?");
      params.push(query.availability);
    }
    if (query.minPrice != null) {
      filters.push("COALESCE(live_price, 1000000000000) >= ?");
      params.push(query.minPrice);
    }
    if (query.maxPrice != null) {
      filters.push("COALESCE(live_price, 0) <= ?");
      params.push(query.maxPrice);
    }

    return {
      whereSql: filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "",
      params,
    };
  }

  private mapRow(row: DbRow): SearchDocument {
    return {
      id: String(row.id),
      storeId: String(row.store_id),
      storeName: String(row.store_name),
      normalizedTitle: String(row.normalized_title),
      title: String(row.title),
      brand: asOptionalString(row.brand),
      model: asOptionalString(row.model),
      sku: asOptionalString(row.sku),
      livePrice: asNumber(row.live_price),
      originalPrice: asNumber(row.original_price),
      onSale: asBoolean(row.on_sale),
      availability: String(row.availability) as SearchDocument["availability"],
      freshnessAt: String(row.freshness_at),
      sourceUrl: String(row.source_url),
      categoryPath: String(row.category_path),
      imageUrl: asOptionalString(row.image_url),
      currency: asOptionalString(row.currency),
      offerLabel: asOptionalString(row.offer_label),
      sellerName: asOptionalString(row.seller_name),
    };
  }
}

function scoreDocument(document: SearchDocument, query: string): number {
  const score = scoreSearchTextMatch(query, [
    { value: document.title, weight: 5 },
    { value: document.normalizedTitle, weight: 4 },
    { value: document.brand, weight: 3 },
    { value: document.model, weight: 2.5 },
    { value: document.sku, weight: 4 },
    { value: document.storeName, weight: 1 },
    { value: document.categoryPath, weight: 1.2 },
  ]);

  return score + (document.onSale ? 0.5 : 0);
}
