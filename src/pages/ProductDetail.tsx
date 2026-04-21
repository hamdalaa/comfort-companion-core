import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronLeft,
  ExternalLink,
  Heart,
  Package,
  Share2,
  ShieldCheck,
  Star,
  Store as StoreIcon,
  TrendingDown,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { TrustBadges } from "@/components/product/TrustBadges";
import { ReviewsBlock } from "@/components/product/ReviewsBlock";

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

  if (loading) return <ProductDetailSkeleton />;

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
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Breadcrumb */}
      <div className="border-b border-border/40">
        <div className="container flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-3 text-[12px] text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">الرئيسية</Link>
          <ChevronLeft className="h-3 w-3 opacity-50" />
          <Link to="/search" className="transition-colors hover:text-foreground">البحث</Link>
          {brand && (
            <>
              <ChevronLeft className="h-3 w-3 opacity-50" />
              <span className="transition-colors hover:text-foreground">{brand}</span>
            </>
          )}
          <ChevronLeft className="h-3 w-3 opacity-50" />
          <span className="line-clamp-1 font-medium text-foreground">{title}</span>
        </div>
      </div>

      {/* Hero — gallery + buy box */}
      <section className="border-b border-border/40">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="absolute end-3 top-3 z-10 inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-card/90 p-1 shadow-sm backdrop-blur-md">
                  <IconAction label="إضافة إلى المفضلة"><Heart className="h-3.5 w-3.5" /></IconAction>
                  <span aria-hidden className="h-4 w-px bg-border/60" />
                  <IconAction label="مشاركة"><Share2 className="h-3.5 w-3.5" /></IconAction>
                </div>

                {savings > 5 && (
                  <div className="absolute start-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background">
                    <TrendingDown className="h-3 w-3" />
                    وفّر {formatCount(savings)}%
                  </div>
                )}

                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={activeImageSrc}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
                  />
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`عرض الصورة ${index + 1}`}
                      className={cn(
                        "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-card ring-1 ring-inset transition-all duration-300",
                        safeActiveImage === index
                          ? "ring-2 ring-foreground"
                          : "ring-border/50 hover:ring-foreground/30",
                      )}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buy box */}
            <div className="flex flex-col">
              {/* Brand · Category */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-muted-foreground">
                {brand && <span className="font-semibold text-foreground/75">{brand}</span>}
                {brand && category && <span className="h-1 w-1 rounded-full bg-muted-foreground/40" aria-hidden />}
                {category && <span>{category}</span>}
              </div>

              {/* Title */}
              <h1 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {title}
              </h1>

              {/* Rating */}
              {product.rating != null && product.rating > 0 && (
                <div className="mt-4 flex items-center gap-2 text-[13px]">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <Star
                        key={step}
                        className={cn(
                          "h-3.5 w-3.5",
                          step <= Math.round(product.rating ?? 0) ? "fill-foreground text-foreground" : "text-muted-foreground/30",
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold tabular-nums text-foreground">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{formatCount(product.reviewCount ?? 0)} تقييم</span>
                </div>
              )}

              {/* Price block */}
              <div className="mt-6 rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  أقل سعر متوفر
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <span className="font-outfit tabular-nums text-4xl font-semibold leading-none tracking-tight text-foreground sm:text-5xl">
                    {product.lowestPrice ? formatIQD(product.lowestPrice) : "—"}
                  </span>
                  {product.highestPrice && product.highestPrice > (product.lowestPrice ?? 0) && (
                    <span className="font-outfit tabular-nums text-base text-muted-foreground/70 line-through">
                      {formatIQD(product.highestPrice)}
                    </span>
                  )}
                </div>

                {bestOffer && (
                  <p className="mt-3 text-[13px] text-muted-foreground">
                    من <span className="font-semibold text-foreground">{decodeHtmlEntities(bestOffer.storeName)}</span>
                    {bestOffer.storeCity && <span> · {bestOffer.storeCity}</span>}
                  </p>
                )}

                {bestOffer ? (
                  <Button asChild size="lg" variant="primary" className="mt-5 w-full rounded-2xl text-[14px]">
                    <a href={bestOffer.productUrl} target="_blank" rel="noopener noreferrer">
                      اشترِ من {decodeHtmlEntities(bestOffer.storeName)}
                      <ExternalLink className="ms-1 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="lg" className="mt-5 w-full rounded-2xl">
                    <Link to="/search">العودة للبحث</Link>
                  </Button>
                )}

                {/* Trust strip */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/50 pt-4 text-[12px] sm:grid-cols-3">
                  {bestOffer?.shippingNote && (
                    <TrustItem icon={Truck} label={bestOffer.shippingNote} />
                  )}
                  {trustedOffers > 0 && (
                    <TrustItem icon={ShieldCheck} label={`${formatCount(trustedOffers)} مصدر موثّق`} />
                  )}
                  {product.inStockCount > 0 && (
                    <TrustItem icon={Check} label={`${formatCount(product.inStockCount)} متوفر`} />
                  )}
                </div>
              </div>

              {/* Trust badges — warranty, shipping, returns, COD */}
              <TrustBadges />

              {/* Quick metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MiniStat value={formatCount(offers.length)} label="متجر" />
                <MiniStat value={formatCount(inStockOffers.length)} label="متوفر" />
                <MiniStat value={savings > 0 ? `${formatCount(savings)}%` : "—"} label="فرق" />
                <MiniStat value={formatCount(trustedOffers)} label="موثّق" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container space-y-12 py-10 md:space-y-16 md:py-14">
        {/* Offers */}
        <section id="all-offers" className="scroll-mt-24">
          <SectionHeader
            kicker="العروض"
            title="جميع المتاجر اللي يبيعون هذا المنتج"
            subtitle="مرتّبة حسب السعر والتوفر — بدون ضجيج."
          />

          {offers.length > 0 ? (
            <div className="mt-6 divide-y divide-border/40 overflow-hidden rounded-3xl border border-border/60 bg-card">
              {offers.map((offer, index) => (
                <OfferRow key={offer.id} offer={offer} highlighted={index === 0 && offer.stock === "in_stock"} />
              ))}
            </div>
          ) : (
            <EmptyPanel>لا توجد عروض شراء مباشرة لهذا المنتج حالياً.</EmptyPanel>
          )}
        </section>

        {/* Reviews */}
        {product.rating != null && product.rating > 0 && (
          <section>
            <SectionHeader
              kicker="التقييمات"
              title="آراء العملاء وتوزيع النجوم"
              subtitle="فلتر بالنجوم لتشوف رأي مَن جرّبه قبلك."
            />
            <div className="mt-6">
              <ReviewsBlock
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </div>
          </section>
        )}

        {/* Details tabs */}
        <section>
          <SectionHeader kicker="التفاصيل" title="مواصفات ووصف المنتج" />

          <Tabs defaultValue="specs" className="mt-6 w-full">
            <TabsList className="h-auto rounded-2xl bg-muted/50 p-1">
              <TabsTrigger value="specs" className="rounded-xl px-4 py-2 text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                المواصفات
              </TabsTrigger>
              <TabsTrigger value="description" className="rounded-xl px-4 py-2 text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                الوصف
              </TabsTrigger>
              <TabsTrigger value="summary" className="rounded-xl px-4 py-2 text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                الملخص
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              {Object.keys(fallbackSpecs).length > 0 ? (
                <dl className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                  {Object.entries(fallbackSpecs).map(([key, value], i, arr) => (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center justify-between gap-4 px-5 py-3.5 text-[13px]",
                        i < arr.length - 1 && "border-b border-border/40",
                      )}
                    >
                      <dt className="text-muted-foreground">{key}</dt>
                      <dd className="font-semibold text-foreground">{decodeHtmlEntities(String(value))}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <EmptyPanel>لا توجد مواصفات تفصيلية لهذا المنتج بعد.</EmptyPanel>
              )}
            </TabsContent>

            <TabsContent value="description" className="mt-6">
              <div className="rounded-2xl border border-border/60 bg-card p-6">
                <p className="text-[14px] leading-7 text-foreground/90">
                  {fallbackDescription || "لا يوجد وصف متاح لهذا المنتج بعد."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryStat icon={StoreIcon} value={formatCount(offers.length)} label="عدد العروض" />
                <SummaryStat icon={Package} value={formatCount(inStockOffers.length)} label="عروض متوفرة" />
                <SummaryStat icon={TrendingDown} value={`${formatCount(savings)}%`} label="فرق السعر" />
                <SummaryStat icon={Award} value={formatCount(trustedOffers)} label="مصادر موثقة" />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
      <StickyBuyBar product={product} bestOffer={bestOffer} offersAnchorId="all-offers" />
    </div>
  );
}

/* ============================================================ */
/*                       Sub-components                         */
/* ============================================================ */

function SectionHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-[14px] text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function IconAction({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-foreground active:scale-95"
    >
      {children}
    </button>
  );
}

function TrustItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-foreground/70" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-muted/40 px-3 py-3 text-center">
      <div className="font-outfit tabular-nums text-lg font-semibold text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

function SummaryStat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="font-outfit tabular-nums mt-3 text-2xl font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-[12px] font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center text-[13px] text-muted-foreground">
      {children}
    </div>
  );
}

function OfferRow({ offer, highlighted = false }: { offer: UnifiedOffer; highlighted?: boolean }) {
  const storeName = decodeHtmlEntities(offer.storeName);
  const official = offer.officialDealer;
  const verified = offer.verified && !official;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 p-5 transition-colors duration-300 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        highlighted && "bg-primary-soft/30",
      )}
    >
      {/* Left: store info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {highlighted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
              الأرخص
            </span>
          )}
          {official ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
              <Award className="h-3 w-3" />
              وكيل رسمي
            </span>
          ) : verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-accent-emerald">
              <ShieldCheck className="h-3 w-3" />
              موثّق
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              offer.stock === "in_stock" && "bg-accent-emerald-soft text-accent-emerald",
              offer.stock === "preorder" && "bg-primary-soft text-primary",
              offer.stock === "out_of_stock" && "bg-destructive/10 text-destructive",
            )}
          >
            {offer.stock === "in_stock" && <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />}
            {offer.stock === "in_stock" ? "متوفر" : offer.stock === "preorder" ? "طلب مسبق" : "نفد"}
          </span>
        </div>

        <h3 className="mt-2 text-[15px] font-semibold text-foreground sm:text-base">{storeName}</h3>

        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
          {offer.storeCity && <span>{offer.storeCity}</span>}
          {offer.shippingNote && (
            <span className="inline-flex items-center gap-1">
              <Truck className="h-3 w-3" />
              {offer.shippingNote}
            </span>
          )}
          {offer.storeRating != null && offer.storeRating > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-foreground text-foreground" />
              <span className="tabular-nums">{offer.storeRating.toFixed(1)}</span>
            </span>
          )}
          {offer.freshnessLabel && <span>{offer.freshnessLabel}</span>}
        </div>
      </div>

      {/* Right: price + CTA */}
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
        <div className="text-end">
          <p className="font-outfit tabular-nums text-xl font-semibold text-foreground sm:text-2xl">
            {formatIQD(offer.price)}
          </p>
          {offer.originalPrice && (
            <p className="font-outfit tabular-nums text-[12px] text-muted-foreground line-through">
              {formatIQD(offer.originalPrice)}
            </p>
          )}
        </div>

        <Button
          asChild
          size="sm"
          variant={highlighted ? "primary" : "outline"}
          className="rounded-xl"
        >
          <a href={offer.productUrl} target="_blank" rel="noopener noreferrer">
            زيارة العرض
            <ArrowLeft className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </article>
  );
}
