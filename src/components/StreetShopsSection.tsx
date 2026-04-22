import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { ShopCard } from "./ShopCard";
import { ShopCarousel } from "./ShopCarousel";
import { ShopCardSkeletonGrid } from "./ShopCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useFakeLoading } from "@/hooks/useFakeLoading";
import { useDataStore } from "@/lib/dataStore";
import { compareShopsByPopularity, getShopReviewCount } from "@/lib/shopRanking";
import { mergeWithLegacySinaaShops } from "@/lib/legacyStreetShops";
import type { Area, Category, Shop } from "@/lib/types";
import { cn } from "@/lib/utils";

const SHOPS_PREVIEW_LIMIT = 15;

const FEATURED_SHOP_KEYWORDS = [
  "AL-NABAA Group",
  "Al-Nabaa",
  "النبع",
  "القيم العالمية",
  "العالمية للحاسبات",
  "الشذر",
  "اللمسه الذكيه",
  "أنس المستقبل",
  "Anas",
  "Qiyam",
];

function featuredRank(name: string): number {
  const lower = name.toLowerCase();
  const index = FEATURED_SHOP_KEYWORDS.findIndex((keyword) => lower.includes(keyword.toLowerCase()));
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function areaToPath(area: Area): string {
  if (area === "شارع الصناعة") return "/sinaa";
  if (area === "شارع الربيعي") return "/rubaie";
  return `/results?area=${encodeURIComponent(area)}`;
}

interface Props {
  area: Area;
  title: string;
  subtitle?: string;
  limit?: number | null;
  hideHeaderCta?: boolean;
}

export function StreetShopsSection({
  area,
  title,
  subtitle,
  limit = SHOPS_PREVIEW_LIMIT,
  hideHeaderCta = false,
}: Props) {
  const { shops, products } = useDataStore();
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const loading = useFakeLoading(700);

  const shopCategoriesFromProducts = useMemo(() => {
    const map = new Map<string, Set<Category>>();
    products.forEach((product) => {
      if (product.area !== area) return;
      if (!map.has(product.shopId)) map.set(product.shopId, new Set());
      map.get(product.shopId)!.add(product.category);
    });
    return map;
  }, [products, area]);

  const streetShops = useMemo(() => {
    const base = shops.filter((shop) => shop.area === area && !shop.archivedAt);
    return area === "شارع الصناعة" ? mergeWithLegacySinaaShops(base) : base;
  }, [shops, area]);

  const effectiveCats = useCallback(
    (shop: typeof streetShops[number]): Set<Category> => {
      const fromProducts = shopCategoriesFromProducts.get(shop.id);
      if (fromProducts && fromProducts.size > 0) return fromProducts;
      if (shop.categories && shop.categories.length > 0) return new Set(shop.categories);
      return new Set([shop.category]);
    },
    [shopCategoriesFromProducts],
  );

  const availableCats = useMemo(() => {
    const counts = new Map<Category, number>();
    streetShops.forEach((shop) => {
      effectiveCats(shop).forEach((category) => counts.set(category, (counts.get(category) ?? 0) + 1));
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [streetShops, effectiveCats]);

  const visibleShops: Shop[] = useMemo(() => {
    const base = activeCat === "all" ? streetShops : streetShops.filter((shop) => effectiveCats(shop).has(activeCat));
    return [...base].sort((a, b) => {
      return (
        getShopReviewCount(b) - getShopReviewCount(a) ||
        featuredRank(a.name) - featuredRank(b.name) ||
        compareShopsByPopularity(a, b)
      );
    });
  }, [streetShops, effectiveCats, activeCat]);

  if (!loading && streetShops.length === 0) return null;

  const catLabelAr: Partial<Record<Category, string>> = {
    Computing: "حاسبات كاملة",
    "PC Parts": "قطع كومبيوتر",
    Networking: "شبكات وراوترات",
    Gaming: "ألعاب وأجهزة",
    Cameras: "كاميرات",
    Printers: "طابعات",
    Phones: "هواتف",
    Chargers: "شواحن",
    Accessories: "إكسسوارات",
    Tablets: "تابلت",
    "Smart Devices": "أجهزة ذكية",
  };

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 sm:p-7 md:p-9">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 pb-4 sm:gap-4 sm:pb-6">
        <div className="min-w-0 flex-1 basis-full max-w-3xl text-right md:basis-auto">
          <div className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80 sm:text-[11px]">
            {area}
          </div>
          <h2 className="font-display mt-2 text-[20px] font-semibold leading-[1.2] tracking-tight text-foreground sm:mt-2.5 sm:text-[34px] md:text-[40px]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 max-w-2xl text-[12.5px] leading-[1.6] text-muted-foreground sm:mt-2 sm:text-sm sm:leading-7">
              {subtitle}
            </p>
          )}
        </div>

        {!hideHeaderCta && (
          <Link
            to={areaToPath(area)}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-[11.5px] font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-muted/40 sm:px-3.5 sm:py-2 sm:text-[12.5px]"
          >
            كل محلات الشارع
            <ArrowLeft className="icon-nudge-x h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="mt-5 flex gap-1.5 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 shrink-0 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="mt-4 sm:mt-6">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={activeCat === "all"} onClick={() => setActiveCat("all")} label="كل المحلات" count={streetShops.length} />
            {availableCats.map(([category, count]) => (
              <FilterChip
                key={category}
                active={activeCat === category}
                onClick={() => setActiveCat(category)}
                label={catLabelAr[category] ?? category}
                count={count}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-7">
        {loading ? (
          <ShopCardSkeletonGrid count={6} />
        ) : visibleShops.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-[13px] text-muted-foreground">ماكو محلات بهالفلتر حالياً. جرّب فئة ثانية.</p>
            <button onClick={() => setActiveCat("all")} className="text-[12px] font-medium text-foreground underline-offset-4 hover:underline">
              امسح الفلتر
            </button>
          </div>
        ) : (
          <>
            {(() => {
              const list = limit == null ? visibleShops : visibleShops.slice(0, limit);
              return (
                <>
                  {/* Mobile + tablet: premium snap carousel */}
                  <ShopCarousel shops={list} hideAbove="xl" />

                  {/* Desktop: grid */}
                  <div className="hidden xl:grid xl:grid-cols-3 xl:gap-5">
                    {list.map((shop, index) => (
                      <div
                        key={shop.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
                      >
                        <ShopCard shop={shop} />
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            {limit != null && (
              <div className="mt-8 flex justify-center">
                <Link
                  to={areaToPath(area)}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-all hover:bg-foreground/90 hover:shadow-sm"
                >
                  عرض كل المحلات ({visibleShops.length.toLocaleString("ar")})
                  <ArrowLeft className="icon-nudge-x h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-all sm:px-3 sm:text-[12px]",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      <span className="truncate">{label}</span>
      <span
        className={cn(
          "shrink-0 tabular-nums text-[10px] font-medium sm:text-[10.5px]",
          active ? "text-background/70" : "text-muted-foreground/70",
        )}
      >
        {count.toLocaleString("ar")}
      </span>
    </button>
  );
}
