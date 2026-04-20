import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  ChevronLeft,
  Clock,
  ExternalLink,
  Heart,
  Home,
  Package,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Store as StoreIcon,
  TrendingDown,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/components/TopNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useProductDetailQuery, useProductOffersQuery } from "@/lib/catalogQueries";
import { cn } from "@/lib/utils";
import { formatIQD, type UnifiedOffer } from "@/lib/unifiedSearch";
import { optimizeImageUrl } from "@/lib/imageUrl";
import { getFallbackProductImage, isRenderableProductImage } from "@/lib/productVisuals";
import { decodeHtmlEntities } from "@/lib/textDisplay";
import { ProductDetailSkeleton } from "@/components/skeletons/PageSkeletons";
import { BackendErrorState } from "@/components/BackendErrorState";

const arabicNumber = new Intl.NumberFormat("ar");
const formatCount = (value: number) => arabicNumber.format(value);

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productQuery = useProductDetailQuery(id);
  const offersQuery = useProductOffersQuery(id);
  const product = productQuery.data ?? null;
  const offers = offersQuery.data ?? [];
  const loading = (productQuery.isLoading || offersQuery.isLoading) && !product;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    document.title = product ? `${decodeHtmlEntities(product.title)} | حاير` : "المنتج | حاير";
  }, [product]);

  const fallbackSpecs = useMemo(() => {
    if (!product) return {};
    if (product.specs && Object.keys(product.specs).length > 0) return product.specs;
    return {
      ...(product.brand ? { البراند: decodeHtmlEntities(product.brand) } : {}),
      ...(product.category ? { الفئة: decodeHtmlEntities(product.category) } : {}),
      ...(typeof product.lowestPrice === "number" ? { "أقل سعر": formatIQD(product.lowestPrice) } : {}),
      ...(typeof product.highestPrice === "number" ? { "أعلى سعر": formatIQD(product.highestPrice) } : {}),
      "عدد العروض": String(product.offerCount),
      "المتوفر حالياً": String(product.inStockCount),
    };
  }, [product]);

  const fallbackDescription = useMemo(() => {
    if (!product) return "";
    if (product.description) return decodeHtmlEntities(product.description);

    const parts = [
      product.brand ? decodeHtmlEntities(product.brand) : undefined,
      decodeHtmlEntities(product.title),
      product.category ? `ضمن فئة ${decodeHtmlEntities(product.category)}` : undefined,
      product.offerCount > 0 ? `ومتوفر حالياً عبر ${formatCount(product.offerCount)} عرض داخل حاير.` : undefined,
    ].filter(Boolean);

    return parts.join(" ");
  }, [product]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product && (productQuery.isError || offersQuery.isError)) {
    return (
      <BackendErrorState
        title="تعذّر تحميل تفاصيل المنتج"
        description="ما گدرنا نوصل لمعلومات هذا المنتج من السيرفر. جرّب إعادة المحاولة أو ارجع للبحث."
        error={(productQuery.error ?? offersQuery.error) as Error | null}
        onRetry={() => {
          productQuery.refetch();
          offersQuery.refetch();
        }}
      />
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen atlas-shell">
        <TopNav />
        <main className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">المنتج غير موجود</h1>
          <Button asChild className="mt-4">
            <Link to="/search">العودة للبحث</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const title = decodeHtmlEntities(product.title);
  const brand = decodeHtmlEntities(product.brand);
  const category = decodeHtmlEntities(product.category);
  const inStockOffers = offers.filter((offer) => offer.stock === "in_stock");
  const bestOffer = inStockOffers[0] ?? offers[0];
  const trustedOffers = offers.filter((offer) => offer.officialDealer || offer.verified).length;
  const savings =
    product.highestPrice && product.lowestPrice && product.highestPrice > product.lowestPrice
      ? Math.round(((product.highestPrice - product.lowestPrice) / product.highestPrice) * 100)
      : 0;

  const fallbackImage = getFallbackProductImage(product.category);
  const renderableImages = product.images.filter((image) => isRenderableProductImage(image));
  const gallery = (renderableImages.length > 0 ? renderableImages : [fallbackImage]).map(
    (image) => optimizeImageUrl(image, { width: 1080, height: 1080 }) ?? image,
  );
  const safeActiveImage = Math.min(activeImageIndex, Math.max(gallery.length - 1, 0));
  const activeImageSrc = gallery[safeActiveImage] ?? fallbackImage;

  return (
    <div className="min-h-screen atlas-shell">
      <TopNav />

      <div className="border-b border-border bg-background">
        <div className="container flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
            <Home className="h-3 w-3" />
            الرئيسية
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link to="/search" className="transition-colors hover:text-primary">
            البحث الموحّد
          </Link>
          {brand && (
            <>
              <ChevronLeft className="h-3 w-3" />
              <span>{brand}</span>
            </>
          )}
          <ChevronLeft className="h-3 w-3" />
          <span className="line-clamp-1 font-medium text-foreground">{title}</span>
        </div>
      </div>

      <section className="relative overflow-hidden border-y border-cyan/25 bg-gradient-to-bl from-emerald/14 via-background to-cyan/12">
        <div aria-hidden className="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-emerald/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />

        <div className="container relative py-8 sm:py-12 md:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
            <div className="order-2 lg:order-1">
              <span className="atlas-kicker">مطابقة السوق</span>

              <h1 className="font-display mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2">
                {brand && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/70 bg-white/90 px-3 py-1 text-xs font-bold shadow-soft-sm backdrop-blur-md"
                  >
                    {brand}
                  </Badge>
                )}
                {category && (
                  <Badge className="rounded-full bg-accent-cyan-soft px-3 py-1 text-accent-cyan shadow-soft-sm hover:bg-accent-cyan-soft">
                    {category}
                  </Badge>
                )}
                <Badge className="gap-1 rounded-full bg-primary-soft px-3 py-1 text-primary shadow-soft-sm hover:bg-primary-soft">
                  <Sparkles className="h-3 w-3" />
                  مقارنة من {formatCount(offers.length)} متجر
                </Badge>
                {trustedOffers > 0 && (
                  <Badge className="gap-1 rounded-full bg-accent-emerald-soft px-3 py-1 text-accent-emerald shadow-soft-sm hover:bg-accent-emerald-soft">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {formatCount(trustedOffers)} مصادر موثقة
                  </Badge>
                )}
              </div>

              <div className="mt-6 rounded-3xl border border-border/70 bg-card/88 p-5 shadow-soft-xl backdrop-blur-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                      أفضل قراءة الآن
                    </p>
                    <div className="mt-3 flex flex-wrap items-end gap-3">
                      <span className="font-outfit tabular-nums text-[2.1rem] font-extrabold leading-none text-foreground sm:text-[2.6rem]">
                        {product.lowestPrice ? formatIQD(product.lowestPrice) : "غير متوفر"}
                      </span>
                      {product.highestPrice && product.highestPrice > (product.lowestPrice ?? 0) && (
                        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft-sm">
                          أعلى قراءة {formatIQD(product.highestPrice)}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {bestOffer
                        ? `أرخص عرض حالياً من ${decodeHtmlEntities(bestOffer.storeName)}`
                        : "لم يتم رصد عروض شراء مباشرة لهذا المنتج بعد."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    {bestOffer ? (
                      <Button asChild className="rounded-full bg-gradient-primary px-5 text-primary-foreground shadow-glow">
                        <a href={bestOffer.productUrl} target="_blank" rel="noopener noreferrer">
                          اشترِ من {decodeHtmlEntities(bestOffer.storeName)}
                          <ExternalLink className="ms-1 h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="rounded-full px-5">
                        <Link to="/search">العودة للبحث</Link>
                      </Button>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground sm:justify-end">
                      {bestOffer?.shippingNote && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 shadow-soft-sm">
                          <Truck className="h-3.5 w-3.5 text-accent-emerald" />
                          {bestOffer.shippingNote}
                        </span>
                      )}
                      {bestOffer?.freshnessLabel && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 shadow-soft-sm">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {bestOffer.freshnessLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {product.rating != null && product.rating > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <Star
                        key={step}
                        className={cn(
                          "h-4 w-4",
                          step <= Math.round(product.rating) ? "fill-warning text-warning" : "text-muted",
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold tabular-nums text-foreground">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({formatCount(product.reviewCount ?? 0)} تقييم)
                  </span>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <MetricCard icon={StoreIcon} value={formatCount(offers.length)} label="متجر" />
                <MetricCard icon={Package} value={formatCount(inStockOffers.length)} label="متوفر" accent="emerald" />
                <MetricCard icon={TrendingDown} value={`${formatCount(savings)}%`} label="فرق السعر" accent="rose" />
                <MetricCard icon={ShieldCheck} value={formatCount(trustedOffers)} label="موثق" />
              </div>

              <div className="mt-4 rounded-[1.8rem] border border-border/70 bg-card/72 p-4 shadow-soft-sm backdrop-blur-sm sm:p-5">
                <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {fallbackDescription || "تفاصيل مباشرة من السوق العراقي مع قراءة واضحة لأفضل الأسعار والعروض الموثقة."}
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-white shadow-soft-xl">

                <div className="absolute start-4 top-4 z-10 flex flex-wrap gap-2">
                  <GlassPill>
                    <StoreIcon className="h-3.5 w-3.5 text-primary" />
                    {formatCount(offers.length)} عرض
                  </GlassPill>
                  {savings > 5 && (
                    <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent-rose px-3 text-[11px] font-bold text-white shadow-soft-md">
                      <TrendingDown className="h-3.5 w-3.5" />
                      وفر حتى {formatCount(savings)}%
                    </span>
                  )}
                  {trustedOffers > 0 && (
                    <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-success px-3 text-[11px] font-bold text-white shadow-soft-md">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      موثّق
                    </span>
                  )}
                </div>

                <div className="absolute end-4 top-4 z-10 flex flex-col gap-2">
                  <button
                    type="button"
                    className="ios-tap hit-target inline-flex items-center justify-center rounded-full border border-border/70 bg-card/96 p-0 text-foreground shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45),0_2px_6px_rgba(15,23,42,0.08)] backdrop-blur-md transition-[background-color,border-color,color,transform,box-shadow] hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:text-primary hover:shadow-[0_14px_28px_-18px_rgba(14,165,164,0.38),0_4px_10px_rgba(15,23,42,0.1)]"
                    aria-label="إضافة إلى المفضلة"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-current transition-[background-color,transform] duration-300">
                      <Heart className="h-[1.05rem] w-[1.05rem] translate-x-[0.01rem] stroke-[2.1]" />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="ios-tap hit-target inline-flex items-center justify-center rounded-full border border-border/70 bg-card/96 p-0 text-foreground shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45),0_2px_6px_rgba(15,23,42,0.08)] backdrop-blur-md transition-[background-color,border-color,color,transform,box-shadow] hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:text-primary hover:shadow-[0_14px_28px_-18px_rgba(14,165,164,0.38),0_4px_10px_rgba(15,23,42,0.1)]"
                    aria-label="مشاركة"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-current transition-[background-color,transform] duration-300">
                      <Share2 className="h-[1.02rem] w-[1.02rem] -translate-x-[0.01rem] stroke-[2.1]" />
                    </span>
                  </button>
                </div>

                <div className="relative flex aspect-[5/4] items-center justify-center px-2 pb-4 pt-16 sm:aspect-square sm:px-3 sm:pb-5 sm:pt-20">
                  <div className="relative z-[1] flex h-full w-full items-center justify-center rounded-[2rem] border border-border/60 bg-white px-3 py-4 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.9)] sm:px-4 sm:py-5">
                    <img
                      src={activeImageSrc}
                      alt={title}
                      className="relative z-[2] h-full w-full scale-[1.04] object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                    />
                  </div>
                </div>

                <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <div className="rounded-[1.55rem] border border-border/75 bg-card p-4 shadow-soft-md">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0 flex-1 text-right">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground/80">
                        قراءة السوق الحالية
                        </p>
                        <h2 className="mt-1 line-clamp-1 text-[1.05rem] font-bold text-foreground sm:text-[1.5rem]">
                          {bestOffer ? decodeHtmlEntities(bestOffer.storeName) : title}
                        </h2>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:text-sm">
                          {bestOffer?.storeCity
                            ? `${bestOffer.storeCity} • ${bestOffer.stock === "in_stock" ? "متوفر الآن" : "متابعة مستمرة"}`
                            : `${formatCount(product.inStockCount)} عرض متوفر حالياً`}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-[1.15rem] border border-border/70 bg-surface px-3.5 py-3 text-right shadow-soft-sm">
                        <p className="text-[10px] font-medium text-muted-foreground">يبدأ من</p>
                        <p className="font-outfit tabular-nums mt-1 text-[1.1rem] font-extrabold leading-none text-foreground sm:text-[1.35rem]">
                          {product.lowestPrice ? formatIQD(product.lowestPrice) : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "img-frame ios-tap relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-white/90 p-1 shadow-soft-sm backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300",
                        safeActiveImage === index
                          ? "border-primary shadow-soft-lg"
                          : "border-border/70 hover:border-primary/30 hover:shadow-soft-md",
                      )}
                    >
                      <img src={image} alt="" className="h-full w-full rounded-[1rem] object-contain bg-surface p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="container space-y-6 py-6 md:space-y-8 md:py-8">
        <section className="rounded-3xl border border-border/70 bg-card/85 p-5 shadow-soft-lg backdrop-blur-sm md:p-6">
          <div className="border-b border-border/70 pb-4">
            <span className="atlas-kicker">العروض</span>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">عروض موثوقة وجاهزة للمقارنة</h2>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  نفس لغة `/brands`: بطاقات واضحة، حالة توفر مباشرة، ومصدر الشراء ظاهر بدون ضجيج.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <SummaryChip>{formatCount(inStockOffers.length)} متوفر الآن</SummaryChip>
                <SummaryChip>{formatCount(trustedOffers)} مصدر موثق</SummaryChip>
                <SummaryChip>{formatCount(offers.length)} عرض مفهرس</SummaryChip>
              </div>
            </div>
          </div>

          {offers.length > 0 ? (
            <div className="mt-5 space-y-3">
              {offers.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} highlighted={index === 0 && offer.stock === "in_stock"} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-border bg-background/70 p-8 text-center text-sm text-muted-foreground">
              لا توجد عروض شراء مباشرة لهذا المنتج حالياً.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-border/70 bg-card/85 p-5 shadow-soft-lg backdrop-blur-sm md:p-6">
          <div className="border-b border-border/70 pb-4">
            <span className="atlas-kicker">التفاصيل</span>
            <h2 className="mt-3 text-2xl font-bold text-foreground">مواصفات مختصرة ووصف المنتج</h2>
          </div>

          <Tabs defaultValue="specs" className="mt-5 w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-background/85 p-1 shadow-soft-sm">
              <TabsTrigger value="specs" className="rounded-full">
                المواصفات
              </TabsTrigger>
              <TabsTrigger value="description" className="rounded-full">
                الوصف
              </TabsTrigger>
              <TabsTrigger value="offers" className="rounded-full">
                الملخص السوقي
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-5">
              {Object.keys(fallbackSpecs).length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(fallbackSpecs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-border/70 bg-background/80 px-4 py-4 shadow-soft-sm"
                    >
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm font-semibold text-foreground">{decodeHtmlEntities(String(value))}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyPanel>لا توجد مواصفات تفصيلية لهذا المنتج بعد.</EmptyPanel>
              )}
            </TabsContent>

            <TabsContent value="description" className="mt-5">
              <div className="rounded-[1.8rem] border border-border/70 bg-background/80 p-5 shadow-soft-sm">
                <p className="text-sm leading-8 text-foreground">
                  {fallbackDescription || "لا يوجد وصف متاح لهذا المنتج بعد."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="offers" className="mt-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={StoreIcon} value={formatCount(offers.length)} label="عدد العروض" />
                <MetricCard icon={Package} value={formatCount(inStockOffers.length)} label="عروض متوفرة" accent="emerald" />
                <MetricCard icon={TrendingDown} value={`${formatCount(savings)}%`} label="فرق السعر" accent="rose" />
                <MetricCard icon={Award} value={formatCount(trustedOffers)} label="مصادر موثقة" />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
  accent = "primary",
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  accent?: "primary" | "emerald" | "rose";
}) {
  const accentClass =
    accent === "emerald"
      ? "bg-accent-emerald-soft text-accent-emerald"
      : accent === "rose"
        ? "bg-accent-rose-soft text-accent-rose"
        : "bg-primary-soft text-primary";

  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-white/85 p-4 text-center shadow-soft-sm backdrop-blur-sm">
      <div className={cn("mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full", accentClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-outfit text-xl font-extrabold text-foreground">{value}</div>
      <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

function GlassPill({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-3 text-[11px] font-semibold text-foreground shadow-soft-sm backdrop-blur-md">
      {children}
    </span>
  );
}

function SummaryChip({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1.5 font-medium text-muted-foreground shadow-soft-sm">
      {children}
    </span>
  );
}

function EmptyPanel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.8rem] border border-dashed border-border bg-background/70 p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function OfferCard({
  offer,
  highlighted = false,
}: {
  offer: UnifiedOffer;
  highlighted?: boolean;
}) {
  const storeName = decodeHtmlEntities(offer.storeName);
  const official = offer.officialDealer;
  const verified = offer.verified && !official;

  return (
    <article
      className={cn(
        "rounded-[1.8rem] border border-border/70 p-4 shadow-soft-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg md:p-5",
        highlighted
          ? "bg-gradient-to-br from-primary-soft/85 via-card to-card shadow-soft-lg"
          : "bg-background/80",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {official ? (
              <Badge className="gap-1 rounded-full bg-primary-soft px-3 py-1 text-primary hover:bg-primary-soft">
                <Award className="h-3.5 w-3.5" />
                وكيل رسمي
              </Badge>
            ) : verified ? (
              <Badge className="gap-1 rounded-full bg-accent-emerald-soft px-3 py-1 text-accent-emerald hover:bg-accent-emerald-soft">
                <ShieldCheck className="h-3.5 w-3.5" />
                موثّق
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                متجر مفهرس
              </Badge>
            )}

            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-3 py-1",
                offer.stock === "in_stock" && "border-success/30 bg-success-soft text-success",
                offer.stock === "preorder" && "border-primary/20 bg-primary-soft text-primary",
                offer.stock === "out_of_stock" && "border-destructive/20 text-destructive",
              )}
            >
              {offer.stock === "in_stock" ? "متوفر" : offer.stock === "preorder" ? "طلب مسبق" : "نفد"}
            </Badge>

            {offer.freshnessLabel && <SummaryChip>{offer.freshnessLabel}</SummaryChip>}
          </div>

          <h3 className="mt-3 text-lg font-bold leading-tight text-foreground">{storeName}</h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {offer.storeCity && <span>{offer.storeCity}</span>}
            {offer.shippingNote && (
              <span className="inline-flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-accent-emerald" />
                {offer.shippingNote}
              </span>
            )}
            {offer.storeRating != null && offer.storeRating > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {offer.storeRating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-white/80 p-4 shadow-soft-sm lg:min-w-[240px]">
          <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-end">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                السعر الحالي
              </p>
              <p className="font-outfit tabular-nums mt-2 text-2xl font-extrabold text-foreground">
                {formatIQD(offer.price)}
              </p>
              {offer.originalPrice && (
                <p className="font-outfit tabular-nums mt-1 text-sm text-muted-foreground line-through">
                  {formatIQD(offer.originalPrice)}
                </p>
              )}
            </div>

            <Button
              asChild
              variant={highlighted ? "default" : "outline"}
              className={cn(
                "w-full rounded-full lg:w-auto",
                highlighted && "bg-gradient-primary text-primary-foreground shadow-glow",
              )}
            >
              <a href={offer.productUrl} target="_blank" rel="noopener noreferrer">
                زيارة العرض
                <ArrowLeft className="ms-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
