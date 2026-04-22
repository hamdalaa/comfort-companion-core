import { type ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home, MapPin, Sparkles, ShieldCheck, Store } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { SiteFooter } from "@/components/SiteFooter";
import { BrandShowcaseCard } from "@/components/BrandShowcaseCard";
import { BrandLogoTile } from "@/components/BrandLogoTile";
import { useDataStore } from "@/lib/dataStore";
import { OFFICIAL_DEALER_BRANCHES } from "@/lib/officialDealers";
import type { BrandDealer } from "@/lib/types";

const arabicNumber = new Intl.NumberFormat("ar");
const formatCount = (value: number) => arabicNumber.format(value);

interface EnrichedBrand extends BrandDealer {
  branchCount: number;
  cityCount: number;
  storeCount: number;
  productCount: number;
}

function toCount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

const PC_PARTS_PRIORITY = [
  "asus",
  "adata",
  "lenovo",
  "hp",
  "msi",
  "gigabyte",
  "logitech",
  "razer",
  "corsair",
  "xpg",
  "wd",
  "seagate",
  "amd",
  "cooler-master",
  "deepcool",
] as const;

const PC_PARTS_KEYWORDS = [
  /asus/i,
  /adata/i,
  /lenovo/i,
  /\bhp\b/i,
  /msi/i,
  /gigabyte/i,
  /logitech/i,
  /razer/i,
  /corsair/i,
  /\bxpg\b/i,
  /\bwd\b|western digital/i,
  /seagate/i,
  /\bamd\b/i,
  /cooler master/i,
  /deepcool/i,
  /a4tech/i,
  /redragon/i,
  /thermaltake/i,
  /arctic/i,
  /\bpny\b/i,
  /lexar/i,
  /hyperx/i,
  /dell/i,
] as const;

const GLOBAL_BRAND_PRIORITY = [
  "apple",
  "samsung",
  "honor",
  "huawei",
  "xiaomi",
  "oppo",
  "vivo",
  "realme",
  "oneplus",
  "motorola",
  "nokia",
  "google",
  "sony",
  "lg",
  "asus",
  "acer",
  "lenovo",
  "hp",
  "dell",
  "msi",
  "intel",
  "amd",
  "nvidia",
  "gigabyte",
  "corsair",
  "cooler-master",
  "deepcool",
  "thermaltake",
  "logitech",
  "razer",
  "anker",
  "ugreen",
  "jbl",
  "bose",
  "beats",
  "canon",
  "nikon",
  "epson",
  "tp-link",
  "sandisk",
] as const;

const normalizeBrandKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const isDisplayableBrand = (brand: EnrichedBrand) =>
  brand.productCount > 0 ||
  brand.storeCount > 0 ||
  brand.branchCount > 0 ||
  brand.cityCount > 0;

export default function Brands() {
  const { brands } = useDataStore();

  const enrichedBrands = useMemo<EnrichedBrand[]>(
    () =>
      brands
        .map((brand) => ({
          ...brand,
          branchCount: OFFICIAL_DEALER_BRANCHES.filter((entry) => entry.brandSlug === brand.slug).length,
          cityCount: brand.cities.length,
          storeCount: toCount((brand as BrandDealer & { storeCount?: number }).storeCount),
          productCount: toCount((brand as BrandDealer & { productCount?: number }).productCount),
        }))
        .sort((a, b) => {
          if (b.branchCount !== a.branchCount) return b.branchCount - a.branchCount;
          if (b.cityCount !== a.cityCount) return b.cityCount - a.cityCount;
          return a.brandName.localeCompare(b.brandName);
        }),
    [brands],
  );

  const curatedBrands = useMemo<EnrichedBrand[]>(() => {
    const picked = new Map<string, EnrichedBrand>();

    for (const preferred of PC_PARTS_PRIORITY) {
      const match = enrichedBrands.find(
        (brand) => brand.slug === preferred || brand.brandName.toLowerCase() === preferred,
      );
      if (match) picked.set(match.slug, match);
    }

    const secondary = enrichedBrands
      .filter((brand) => !picked.has(brand.slug))
      .filter((brand) =>
        PC_PARTS_KEYWORDS.some((pattern) => pattern.test(brand.brandName) || pattern.test(brand.slug)),
      )
      .sort(
        (a, b) =>
          b.productCount - a.productCount ||
          b.storeCount - a.storeCount ||
          a.brandName.localeCompare(b.brandName),
      );

    for (const brand of secondary) {
      if (picked.size >= 15) break;
      picked.set(brand.slug, brand);
    }

    return [...picked.values()].slice(0, 15);
  }, [enrichedBrands]);

  const totalProducts = useMemo(
    () => curatedBrands.reduce((sum, brand) => sum + brand.productCount, 0),
    [curatedBrands],
  );

  const totalStores = useMemo(
    () => curatedBrands.reduce((sum, brand) => sum + brand.storeCount, 0),
    [curatedBrands],
  );

  const totalOfficialBranches = useMemo(
    () => curatedBrands.reduce((sum, brand) => sum + brand.branchCount, 0),
    [curatedBrands],
  );

  const topGlobalBrands = useMemo<EnrichedBrand[]>(() => {
    const picked = new Map<string, EnrichedBrand>();

    for (const preferred of GLOBAL_BRAND_PRIORITY) {
      const match = enrichedBrands.find((brand) => {
        const slugKey = normalizeBrandKey(brand.slug);
        const nameKey = normalizeBrandKey(brand.brandName);
        const preferredKey = normalizeBrandKey(preferred);
        return slugKey === preferredKey || nameKey === preferredKey;
      });
      if (match && isDisplayableBrand(match)) picked.set(match.slug, match);
    }

    const secondary = enrichedBrands
      .filter((brand) => !picked.has(brand.slug))
      .filter(isDisplayableBrand)
      .sort(
        (a, b) =>
          b.productCount - a.productCount ||
          b.storeCount - a.storeCount ||
          b.branchCount - a.branchCount ||
          a.brandName.localeCompare(b.brandName),
      );

    for (const brand of secondary) {
      if (picked.size >= 40) break;
      picked.set(brand.slug, brand);
    }

    return [...picked.values()].slice(0, 40);
  }, [enrichedBrands]);

  const totalBranches = useMemo(
    () => enrichedBrands.reduce((sum, brand) => sum + brand.branchCount, 0),
    [enrichedBrands],
  );

  const totalCities = useMemo(
    () => new Set(enrichedBrands.flatMap((brand) => brand.cities)).size,
    [enrichedBrands],
  );

  return (
    <div className="min-h-screen flex flex-col atlas-shell">
      <TopNav />

      <div className="border-b border-border bg-background">
        <div className="container flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
            <Home className="h-3 w-3" />
            الرئيسية
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="font-semibold text-foreground">وكلاء البراندات</span>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]"
        />
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-accent-cyan/10 blur-3xl" />

        <div className="container relative py-10 sm:py-14 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              الوكلاء الرسميون في العراق
            </span>
            <h1 className="font-display mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              اشترِ من <span className="text-primary">المصدر الموثوق</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              وكلاء معتمدون رسمياً مع تغطية واضحة للفروع والمدن.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
            <HeroStat value={formatCount(enrichedBrands.length)} label="براند" icon={<ShieldCheck className="h-3.5 w-3.5 text-primary" />} />
            <HeroStat value={formatCount(totalBranches)} label="فرع رسمي" icon={<Store className="h-3.5 w-3.5 text-primary" />} />
            <HeroStat value={formatCount(totalCities)} label="مدن" icon={<MapPin className="h-3.5 w-3.5 text-primary" />} />
          </div>
        </div>
      </section>

      <main className="container flex-1 py-6 md:py-10">
        {/* ===== ALL BRANDS — logo-first dense grid (theSVG) ===== */}
        {enrichedBrands.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/85 p-10 text-center shadow-soft-sm">
            <p className="text-sm text-muted-foreground">ماكو براندات حالياً.</p>
          </div>
        ) : (
          <>
            <SectionHeader
              title="كل البراندات"
              subtitle="شعارات أصلية من theSVG — اضغط على أي براند لشوف الفروع والمنتجات."
              count={topGlobalBrands.length}
            />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
              {topGlobalBrands.map((brand, idx) => (
                <BrandLogoTile
                  key={brand.slug}
                  brand={brand}
                  branchCount={brand.branchCount}
                  eager={idx < 12}
                />
              ))}
            </div>
          </>
        )}

        {/* ===== FEATURED — image-led showcase cards ===== */}
        {curatedBrands.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <SectionHeader
              title="براندات قطع الحاسبات"
              subtitle="اختيار سريع لأبرز براندات الهاردوير وملحقات البيسي."
              meta={`${formatCount(totalProducts)} منتج · ${formatCount(totalStores)} متجر · ${formatCount(totalOfficialBranches)} فرع رسمي`}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {curatedBrands.map((brand, idx) => (
                <BrandShowcaseCard key={`pc-${brand.slug}`} brand={brand} index={idx} />
              ))}
            </div>
          </section>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          * نعرض أشهر 40 براند لتخفيف الحمل.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  meta,
  count,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  count?: number;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 border-b border-border/60 pb-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          {title}
          {typeof count === "number" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
              {formatCount(count)}
            </span>
          )}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {meta && (
        <div className="text-xs font-medium text-muted-foreground">{meta}</div>
      )}
    </div>
  );
}

function HeroStat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className="min-w-[84px] rounded-[1.35rem] border border-white/70 bg-white/85 px-3 py-3 text-center shadow-soft-sm backdrop-blur-md">
      <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft">
        {icon}
      </div>
      <div className="text-base font-bold tabular-nums text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
