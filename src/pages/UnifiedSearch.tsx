/**
 * Unified Search Page (/search)
 * -----------------------------
 * Tabs: products (cross-store offers) | shops (local directory).
 * Features:
 *   - Live autocomplete (products + shops) while typing
 *   - Keyboard nav: ↑/↓/Enter/Esc, "/" to focus from anywhere on page
 *   - Recent searches with per-item remove + clear all
 *   - Popular queries fallback
 *   - Result counts on each tab
 *   - Shareable URL state: ?q=...&tab=products|shops&sort=...
 *
 * Backend hand-off:
 *   - Products: searchUnified() — replace mock with POST /api/search
 *   - Shops:    searchShops()   — replace local filter with GET /api/shops/search
 */

import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Package,
  Search,
  Sparkles,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TopNav } from "@/components/TopNav";
import { SiteFooter } from "@/components/SiteFooter";
import { UnifiedProductCard } from "@/components/UnifiedProductCard";
import { UnifiedSearchFilters } from "@/components/UnifiedSearchFilters";
import { ShopFilters } from "@/components/ShopFilters";
import { ShopResultCard } from "@/components/ShopResultCard";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { EmptyState } from "@/components/EmptyState";
import { SortPillsBar } from "@/components/SortPillsBar";

import { useDataStore } from "@/lib/dataStore";
import { getPublicProductCount, getPublicStoreCount } from "@/lib/catalogCounts";
import { getShopImage, preloadShopImages } from "@/lib/shopImages";
import { cn } from "@/lib/utils";
import {
  buildAutocomplete,
  searchShops,
  searchUnified,
  type AutocompleteSuggestion,
  type ShopSearchFilters,
  type ShopSortKey,
  type SortKey,
  type UnifiedSearchFilters as Filters,
  type UnifiedSearchResponse,
} from "@/lib/unifiedSearch";

type Tab = "products" | "shops";

const PRODUCT_SORT: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "الأكثر صلة" },
  { value: "price_asc", label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
  { value: "rating_desc", label: "الأعلى تقييماً" },
  { value: "offers_desc", label: "الأكثر عروضاً" },
  { value: "freshness_desc", label: "الأحدث تحديثاً" },
];

const SHOP_SORT: { value: ShopSortKey; label: string }[] = [
  { value: "relevance", label: "الأكثر صلة" },
  { value: "rating_desc", label: "الأعلى تقييماً" },
  { value: "verified_first", label: "الموثّق أولاً" },
  { value: "name_asc", label: "الاسم (أ-ي)" },
];

const POPULAR_QUERIES = [
  "iPhone 15", "PlayStation 5", "MacBook Pro", "Galaxy S24",
  "AirPods", "Anker", "Samsung TV", "ASUS",
];

const RECENT_KEY = "hayer:recent-unified-searches";
const AUTOCOMPLETE_PRODUCT_POOL_LIMIT = 1500;
const INITIAL_VISIBLE_PRODUCT_COUNT = 24;

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
}
function saveRecent(list: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 10)));
}
function pushRecent(q: string) {
  if (!q.trim()) return;
  const cur = getRecent().filter((x) => x !== q);
  saveRecent([q, ...cur]);
}

export default function UnifiedSearch() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const { shops, products, summary, prefetchProductIndex } = useDataStore();

  const activeQuery = params.get("q") ?? "";
  const activeTab: Tab = (params.get("tab") as Tab) === "shops" ? "shops" : "products";

  const [query, setQuery] = useState(activeQuery);
  const [filters, setFilters] = useState<Filters>({});
  const [shopFilters, setShopFilters] = useState<ShopSearchFilters>({});
  const [sort, setSort] = useState<SortKey>("relevance");
  const [shopSort, setShopSort] = useState<ShopSortKey>("relevance");
  const [data, setData] = useState<UnifiedSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>(getRecent());
  const [visibleProductCount, setVisibleProductCount] = useState(INITIAL_VISIBLE_PRODUCT_COUNT);

  const [acOpen, setAcOpen] = useState(false);
  const [acIndex, setAcIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(activeQuery); }, [activeQuery]);

  useEffect(() => {
    document.title = activeQuery
      ? `${activeQuery} — بحث | حاير`
      : "البحث الموحّد | حاير";
  }, [activeQuery]);

  useEffect(() => {
    void prefetchProductIndex();
  }, [prefetchProductIndex]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchUnified({ ...filters, q: activeQuery, sort })
      .then((res) => {
        if (!cancelled) { setData(res); setLoading(false); }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[UnifiedSearch] fetch failed", err);
        setError(err instanceof Error ? err.message : "تعذّر الاتصال بالخادم");
        setData(null);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeQuery, filters, sort]);

  const shopResult = useMemo(
    () => searchShops(shops, { ...shopFilters, q: activeQuery, sort: shopSort }),
    [shops, activeQuery, shopSort, shopFilters],
  );

  const deferredAutocompleteQuery = useDeferredValue(query);
  const normalizedAutocompleteQuery = deferredAutocompleteQuery.trim();
  const shouldShowAutocomplete = normalizedAutocompleteQuery.length >= 2;
  const autocompleteProducts = useMemo(
    () => (products.length > AUTOCOMPLETE_PRODUCT_POOL_LIMIT
      ? products.slice(0, AUTOCOMPLETE_PRODUCT_POOL_LIMIT)
      : products),
    [products],
  );
  const suggestions: AutocompleteSuggestion[] = useMemo(
    () => (shouldShowAutocomplete
      ? buildAutocomplete(normalizedAutocompleteQuery, shops, autocompleteProducts, 8)
      : []),
    [shouldShowAutocomplete, normalizedAutocompleteQuery, shops, autocompleteProducts],
  );

  useEffect(() => {
    setVisibleProductCount(INITIAL_VISIBLE_PRODUCT_COUNT);
  }, [activeQuery, filters, sort]);

  const resetProductFilters = useCallback(() => setFilters({}), []);
  const resetShopFilters = useCallback(() => setShopFilters({}), []);
  const handleLoadMoreProducts = useCallback(() => {
    setVisibleProductCount((count) => count + INITIAL_VISIBLE_PRODUCT_COUNT);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function commitSearch(q: string, tab: Tab = activeTab) {
    const next = q.trim();
    if (next) pushRecent(next);
    setRecent(getRecent());
    const sp = new URLSearchParams();
    if (next) sp.set("q", next);
    if (tab === "shops") sp.set("tab", "shops");
    setParams(sp);
    setAcOpen(false);
    setAcIndex(-1);
    inputRef.current?.blur();
  }

  function setTab(tab: Tab) {
    const sp = new URLSearchParams(params);
    if (tab === "shops") sp.set("tab", "shops"); else sp.delete("tab");
    setParams(sp);
  }

  function clearQuery() {
    setQuery("");
    setParams((sp) => {
      const next = new URLSearchParams(sp);
      next.delete("q");
      return next;
    });
    inputRef.current?.focus();
  }

  function removeRecent(q: string) {
    const next = getRecent().filter((x) => x !== q);
    saveRecent(next);
    setRecent(next);
  }
  function clearAllRecent() { saveRecent([]); setRecent([]); }

  function handleAcSelect(s: AutocompleteSuggestion) {
    setAcOpen(false);
    nav(s.href);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      if (acOpen) { setAcOpen(false); return; }
      if (query) { clearQuery(); return; }
    }
    if (!acOpen || !suggestions.length) {
      if (e.key === "Enter") { e.preventDefault(); commitSearch(query); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAcIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAcIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (acIndex >= 0 && suggestions[acIndex]) handleAcSelect(suggestions[acIndex]);
      else commitSearch(query);
    }
  }

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    filters.brands?.forEach((b) => chips.push({ label: b, clear: () => setFilters((f) => ({ ...f, brands: f.brands?.filter((x) => x !== b) })) }));
    filters.categories?.forEach((c) => chips.push({ label: c, clear: () => setFilters((f) => ({ ...f, categories: f.categories?.filter((x) => x !== c) })) }));
    filters.stores?.forEach((s) => chips.push({ label: s, clear: () => setFilters((f) => ({ ...f, stores: f.stores?.filter((x) => x !== s) })) }));
    filters.cities?.forEach((c) => chips.push({ label: c, clear: () => setFilters((f) => ({ ...f, cities: f.cities?.filter((x) => x !== c) })) }));
    if (filters.inStockOnly) chips.push({ label: "متوفر", clear: () => setFilters((f) => ({ ...f, inStockOnly: undefined })) });
    if (filters.onSaleOnly) chips.push({ label: "تخفيض", clear: () => setFilters((f) => ({ ...f, onSaleOnly: undefined })) });
    if (filters.verifiedOnly) chips.push({ label: "موثّق", clear: () => setFilters((f) => ({ ...f, verifiedOnly: undefined })) });
    if (filters.officialDealerOnly) chips.push({ label: "وكيل رسمي", clear: () => setFilters((f) => ({ ...f, officialDealerOnly: undefined })) });
    return chips;
  }, [filters]);

  const hasProductFilters =
    Boolean(activeQuery.trim()) ||
    Boolean(filters.brands?.length) ||
    Boolean(filters.categories?.length) ||
    Boolean(filters.stores?.length) ||
    Boolean(filters.cities?.length) ||
    filters.priceMin != null ||
    filters.priceMax != null ||
    Boolean(filters.inStockOnly) ||
    Boolean(filters.onSaleOnly) ||
    Boolean(filters.verifiedOnly) ||
    Boolean(filters.officialDealerOnly);

  const hasShopFilters =
    Boolean(activeQuery.trim()) ||
    Boolean(shopFilters.cities?.length) ||
    Boolean(shopFilters.categories?.length) ||
    Boolean(shopFilters.verifiedOnly) ||
    Boolean(shopFilters.ratingMin) ||
    Boolean(shopFilters.hasWebsite) ||
    Boolean(shopFilters.hasPhone);
  const publicShopCount = shops.filter((shop) => !shop.archivedAt).length;
  const visibleProducts = useMemo(
    () => data?.products.slice(0, visibleProductCount) ?? [],
    [data, visibleProductCount],
  );
  const hasMoreProducts = (data?.products.length ?? 0) > visibleProductCount;

  const defaultProductCount = getPublicProductCount(summary.totalProducts, products.length);
  const defaultShopCount = getPublicStoreCount(summary.totalStores, publicShopCount);
  const productCount = data?.totalProducts ?? (hasProductFilters ? 0 : defaultProductCount);
  const shopCount = activeTab === "products"
    ? (data?.storesCovered ?? defaultShopCount)
    : (hasShopFilters ? shopResult.totalShops : defaultShopCount);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* HERO + SEARCH BAR */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        {/* === Creative animated background === */}
        {/* Floating gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 -z-10 h-[28rem] w-[28rem] rounded-full opacity-60 blur-[110px] mix-blend-screen dark:mix-blend-plus-lighter motion-safe:animate-[blob-drift_18s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--accent-violet) / 0.55), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-55 blur-[120px] mix-blend-screen dark:mix-blend-plus-lighter motion-safe:animate-[blob-drift-2_22s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.55), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-16 -z-10 h-[30rem] w-[30rem] rounded-full opacity-55 blur-[120px] mix-blend-screen dark:mix-blend-plus-lighter motion-safe:animate-[blob-drift-3_24s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle at 60% 40%, hsl(var(--accent-cyan) / 0.5), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/4 -z-10 h-[22rem] w-[22rem] rounded-full opacity-45 blur-[100px] mix-blend-screen dark:mix-blend-plus-lighter motion-safe:animate-[blob-drift_26s_ease-in-out_infinite_reverse]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent-rose) / 0.45), transparent 65%)" }}
        />
        {/* Subtle dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--foreground) / 0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        {/* Top conic shimmer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), hsl(var(--accent-violet) / 0.6), hsl(var(--accent-cyan) / 0.6), transparent)",
          }}
        />

        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-3 gap-1 bg-primary-soft text-primary hover:bg-primary-soft">
              <Sparkles className="h-3 w-3" />
              بحث موحّد ذكي
            </Badge>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              ابحث عن <span className="text-primary">منتج</span> أو <span className="text-primary">محل</span> بنقرة وحدة
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              نجمع لك العروض من جميع المتاجر العراقية ودليل المحلات في مكان واحد.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); commitSearch(query); }}
              className="relative z-40 mx-auto mt-6 max-w-2xl"
            >
              <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft-lg transition-all focus-within:border-primary/40 focus-within:shadow-soft-xl sm:gap-1.5 sm:p-1.5">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-4">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setQuery(nextValue);
                      setAcOpen(nextValue.trim().length >= 2);
                      setAcIndex(-1);
                    }}
                    onFocus={() => setAcOpen(query.trim().length >= 2)}
                    onBlur={() => setTimeout(() => setAcOpen(false), 150)}
                    onKeyDown={onInputKeyDown}
                    placeholder="iPhone 15، PlayStation، اسم محل…  (اضغط / للتركيز)"
                    className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60 sm:h-12 sm:text-base"
                    autoComplete="off"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={clearQuery}
                      aria-label="مسح"
                      className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-11 shrink-0 gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-none transition-all hover:bg-primary/90 hover:shadow-soft-md sm:h-12 sm:px-6"
                >
                  <Search className="h-4 w-4 sm:hidden" />
                  <span>ابحث</span>
                  <ArrowLeft className="hidden h-4 w-4 sm:block" />
                </Button>
              </div>

              {acOpen && shouldShowAutocomplete && (
                <SearchAutocomplete
                  query={query}
                  suggestions={suggestions}
                  highlightedIndex={acIndex}
                  onHover={setAcIndex}
                  onSelect={handleAcSelect}
                  onSubmitQuery={() => commitSearch(query)}
                />
              )}
            </form>

            {!activeQuery && (
              <div className="mt-5 space-y-3">
                {recent.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> أبحاث سابقة:
                    </span>
                    {recent.map((q) => (
                      <span
                        key={q}
                        className="group/chip inline-flex items-center gap-1 rounded-full border border-border bg-card pe-1 ps-3 py-1 text-xs text-foreground transition-colors hover:border-primary/40"
                      >
                        <button
                          type="button"
                          onClick={() => commitSearch(q)}
                          className="hover:text-primary"
                        >
                          {q}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRecent(q)}
                          aria-label={`حذف ${q}`}
                          className="grid h-4 w-4 place-items-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-surface group-hover/chip:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                      مسح الكل
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground">شائع:</span>
                  {POPULAR_QUERIES.map((q, i) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => commitSearch(q)}
                      className={cn(
                        "rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary",
                        i >= 3 && "hidden sm:inline-flex",
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TABS BAR */}
      <div className="relative z-30 border-b border-border bg-background">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4">
          <div className="flex">
            <TabButton
              active={activeTab === "products"}
              onClick={() => setTab("products")}
              icon={<Package className="h-4 w-4" />}
              label="منتجات"
              count={productCount}
            />
            <TabButton
              active={activeTab === "shops"}
              onClick={() => setTab("shops")}
              icon={<Store className="h-4 w-4" />}
              label="محلات"
              count={shopCount}
            />
          </div>

          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span>ترتيب:</span>
            {activeTab === "products" ? (
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-8 w-[180px] rounded-lg text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_SORT.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <Select value={shopSort} onValueChange={(v) => setShopSort(v as ShopSortKey)}>
                <SelectTrigger className="h-8 w-[180px] rounded-lg text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SHOP_SORT.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* BODY — always show results; live-filter as the user types */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {activeTab === "products" ? (
          <ProductsView
            data={data}
            loading={loading}
            error={error}
            visibleProducts={visibleProducts}
            hasMoreProducts={hasMoreProducts}
            onLoadMore={handleLoadMoreProducts}
            filters={filters}
            setFilters={setFilters}
            sort={sort}
            setSort={setSort}
            activeChips={activeChips}
            onResetFilters={resetProductFilters}
          />
        ) : (
          <ShopsView
            shopResult={shopResult}
            sort={shopSort}
            setSort={setShopSort}
            filters={shopFilters}
            setFilters={setShopFilters}
            onResetFilters={resetShopFilters}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function TabButton({
  active, onClick, icon, label, count,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
      {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-primary" />}
    </button>
  );
}

const ProductsView = memo(function ProductsView({
  data, loading, error, visibleProducts, hasMoreProducts, onLoadMore, filters, setFilters, sort, setSort, activeChips, onResetFilters,
}: {
  data: UnifiedSearchResponse | null;
  loading: boolean;
  error: string | null;
  visibleProducts: UnifiedSearchResponse["products"];
  hasMoreProducts: boolean;
  onLoadMore: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  activeChips: { label: string; clear: () => void }[];
  onResetFilters: () => void;
}) {
  if (error && !loading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-destructive/10" aria-hidden />
            <AlertTriangle className="relative h-6 w-6" strokeWidth={2.2} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              اكو مشكلة بالاتصال حالياً
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ما گدرنا نوصل لخادم المنتجات. جرّب تعيد المحاولة بعد لحظة.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="rounded-full px-6"
          >
            إعادة المحاولة
          </Button>
          <code className="block max-w-full truncate text-[10px] text-muted-foreground/60">
            {error}
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {data && (
        <div className="hidden lg:block">
          <UnifiedSearchFilters
            facets={data.facets}
            value={filters}
            onChange={setFilters}
            onReset={onResetFilters}
          />
        </div>
      )}

      <div className="min-w-0">
        {/* Mobile filter + sort bar */}
        <div className="mb-4 flex items-center justify-between gap-2 lg:hidden">
          {data && (
            <UnifiedSearchFilters
              facets={data.facets}
              value={filters}
              onChange={setFilters}
              onReset={onResetFilters}
            />
          )}
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-9 flex-1 rounded-lg text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRODUCT_SORT.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Quick sort pills + active filter chips */}
        <div className="mb-4">
          <SortPillsBar
            sort={sort}
            onSortChange={setSort}
            totalResults={data?.totalProducts}
            activeChips={activeChips}
            onClearAll={activeChips.length > 0 ? onResetFilters : undefined}
          />
        </div>

        {loading && visibleProducts.length > 0 && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            جاري تحديث النتائج...
          </div>
        )}

        {loading && visibleProducts.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
            ))}
          </div>
        ) : data && data.products.length === 0 ? (
          <EmptyState
            title="ما لگينا منتجات"
            description="جرّب كلمات مختلفة أو امسح الفلاتر."
            action={<Button onClick={onResetFilters} variant="outline">مسح الفلاتر</Button>}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {visibleProducts.map((p) => <UnifiedProductCard key={p.id} product={p} />)}
            </div>

            {hasMoreProducts && (
              <div className="mt-6 flex justify-center">
                <Button onClick={onLoadMore} variant="outline" className="rounded-full px-6">
                  عرض المزيد
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});
ProductsView.displayName = "ProductsView";

const ShopsView = memo(function ShopsView({
  shopResult, sort, setSort, filters, setFilters, onResetFilters,
}: {
  shopResult: ReturnType<typeof searchShops>;
  sort: ShopSortKey;
  setSort: (s: ShopSortKey) => void;
  filters: ShopSearchFilters;
  setFilters: (f: ShopSearchFilters) => void;
  onResetFilters: () => void;
}) {
  const [, setShopImagesVersion] = useState(0);
  const shopsToEnrich = useMemo(
    () => shopResult.shops.filter((shop) => !shop.imageUrl && shop.citySlug).slice(0, 48),
    [shopResult.shops],
  );

  useEffect(() => {
    let cancelled = false;
    if (shopsToEnrich.length === 0) return;

    preloadShopImages(shopsToEnrich).then(() => {
      if (!cancelled) {
        setShopImagesVersion((version) => version + 1);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [shopsToEnrich]);

  const activeChips: { label: string; clear: () => void }[] = [];
  filters.categories?.forEach((c) =>
    activeChips.push({
      label: c,
      clear: () =>
        setFilters({ ...filters, categories: filters.categories?.filter((x) => x !== c) }),
    }),
  );
  filters.cities?.forEach((c) =>
    activeChips.push({
      label: c,
      clear: () =>
        setFilters({ ...filters, cities: filters.cities?.filter((x) => x !== c) }),
    }),
  );
  if (filters.verifiedOnly)
    activeChips.push({ label: "موثّق", clear: () => setFilters({ ...filters, verifiedOnly: undefined }) });
  if (filters.hasPhone)
    activeChips.push({ label: "فيه رقم", clear: () => setFilters({ ...filters, hasPhone: undefined }) });
  if (filters.hasWebsite)
    activeChips.push({ label: "عنده موقع", clear: () => setFilters({ ...filters, hasWebsite: undefined }) });

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <div className="hidden xl:block">
        <ShopFilters
          facets={shopResult.facets}
          value={filters}
          onChange={setFilters}
          onReset={onResetFilters}
        />
      </div>

      <div className="min-w-0 space-y-4">
        {/* Mobile filter + sort bar */}
        <div className="flex items-center justify-between gap-2 xl:hidden">
          <ShopFilters
            facets={shopResult.facets}
            value={filters}
            onChange={setFilters}
            onReset={onResetFilters}
          />
          <Select value={sort} onValueChange={(v) => setSort(v as ShopSortKey)}>
            <SelectTrigger className="h-9 flex-1 rounded-lg text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SHOP_SORT.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={chip.clear}
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              مسح الكل
            </button>
          </div>
        )}

        {shopResult.shops.length === 0 ? (
          <EmptyState
            title="ما لگينا محلات"
            description="جرّب اسم محل ثاني، أو امسح الفلاتر، أو شوف دليل المحلات الكامل."
            action={
              <Button onClick={onResetFilters} variant="outline">مسح الفلاتر</Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
            {shopResult.shops.map((s, i) => (
              <ShopResultCard key={s.id} shop={s} previewImageUrl={getShopImage(s)} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
ShopsView.displayName = "ShopsView";
