import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import baghdadPinsMap from "@/assets/baghdad-pins-map.webp";
import iraqCitiesPano from "@/assets/iraq-cities-pano.webp";
import { CategoryCircles } from "@/components/CategoryCircles";
import { HowItWorks } from "@/components/HowItWorks";
import { SiteFooter } from "@/components/SiteFooter";
import { MetricsStrip } from "@/components/MetricsStrip";
import { ShopCard } from "@/components/ShopCard";
import { ShopCarousel } from "@/components/ShopCarousel";
import { ShopCardSkeletonGrid } from "@/components/ShopCardSkeleton";
import { BrandShowcaseCard } from "@/components/BrandShowcaseCard";
import { BrandCarousel } from "@/components/BrandCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { StreetShopsSection } from "@/components/StreetShopsSection";
import { BrandStrip } from "@/components/BrandStrip";
import { ContactStrip } from "@/components/ContactStrip";
import { useDataStore } from "@/lib/dataStore";
import { useFakeLoading } from "@/hooks/useFakeLoading";
import { compareCatalogShopsByPriority } from "@/lib/shopRanking";

interface SectionHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  seeAll?: string;
}

function SectionHeader({ kicker, title, description, seeAll }: SectionHeaderProps) {
  return (
    <div className="border-b border-border pb-5 sm:pb-6">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl text-right">
          <span className="atlas-kicker">{kicker}</span>
          <h2 className="font-display mt-3 text-balance text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-pretty text-sm leading-7 text-muted-foreground sm:mt-3 sm:text-base sm:leading-8">{description}</p>
          )}
        </div>
        {seeAll && (
          <Link
            to={seeAll}
            className="link-underline inline-flex min-h-10 shrink-0 items-center text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:text-primary-glow"
          >
            عرض الكل ←
          </Link>
        )}
      </div>
    </div>
  );
}

export default function IndexDeferredSections() {
  const { shops, brands } = useDataStore();
  const loading = useFakeLoading(700);

  const featured = [...shops]
    .filter((shop) => !shop.archivedAt)
    .filter((shop) => (shop.productCount ?? 0) > 0 || Boolean(shop.website) || Boolean(shop.featured))
    .sort(compareCatalogShopsByPriority)
    .slice(0, 6);

  const activeShops = shops.filter((shop) => !shop.archivedAt);
  const ratedShops = activeShops.filter(
    (shop) => typeof shop.rating === "number" && (shop.rating ?? 0) > 0,
  );
  const topRatedSource = ratedShops.length > 0 ? ratedShops : activeShops;
  const topRated = [...topRatedSource]
    .sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      const reviewDiff = (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      if (reviewDiff !== 0) return reviewDiff;
      return compareCatalogShopsByPriority(a, b);
    })
    .slice(0, 6);

  return (
    <>
      <main className="pb-12 sm:pb-20">
        <section className="group relative mt-8 overflow-hidden border-y border-border/60 bg-background sm:mt-16 md:mt-24">
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-24 h-56 w-56 rounded-full bg-cyan/10 blur-3xl sm:h-80 sm:w-80 sm:bg-cyan/14" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-24 h-56 w-56 rounded-full bg-emerald/10 blur-3xl sm:h-80 sm:w-80 sm:bg-emerald/12" />

          <div className="container py-10 sm:py-16 md:py-20">
            <SectionHeader
              kicker="الفئات"
              title="ابدأ من القسم الأقرب لحاجتك"
              seeAll="/results"
              description="بدل البحث العشوائي، اختر الفئة أولاً ثم خلِّ التصفية تكمل المشوار."
            />
            <div className="mt-5 sm:mt-8">
              <CategoryCircles />
            </div>
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden border-y border-cyan/25 bg-gradient-to-bl from-cyan/14 via-background to-emerald/12 sm:mt-20 md:mt-28">
          <div aria-hidden className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan/22 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-emerald/20 blur-3xl" />
          <div className="container py-10 sm:py-16 md:py-20">
            <div className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-foreground/[0.04] px-6 py-12 shadow-soft backdrop-blur-sm sm:px-12 sm:py-20 md:px-20 md:py-24">
              <img
                aria-hidden
                src={baghdadPinsMap}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 95% 80% at 30% 50%, black 25%, transparent 90%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 95% 80% at 30% 50%, black 25%, transparent 90%)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-l from-card/70 via-card/20 to-transparent"
              />

              <div className="relative grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Baghdad · بغداد
                  </div>
                  <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl tracking-tight">
                    مسارات{" "}
                    <span className="bg-gradient-to-br from-primary via-primary to-foreground bg-clip-text text-transparent">
                      بغداد
                    </span>
                    <span className="mt-3 block text-base font-medium leading-7 tracking-normal text-muted-foreground sm:mt-4 sm:text-base sm:leading-8">
                      دليلك المرجعي للأسواق التقنية.
                    </span>
                  </h2>
                </div>

                <div className="lg:col-span-5 lg:col-start-8 flex flex-col gap-6 pb-2 text-right">
                  <p className="text-base leading-[1.9] text-foreground/85 sm:text-lg">
                    في قلب العاصمة، يبرز شارعا
                    <span className="font-semibold text-primary"> الصناعة والربيعي </span>
                    كشرايين نابضة لسوق الإلكترونيات في بغداد.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:mt-12 sm:gap-8">
              <StreetShopsSection
                area="شارع الصناعة"
                title="شارع الصناعة"
                subtitle="حاسبات، قطع، شبكات وطابعات — أهم محلات الفئة في بغداد."
              />

              <StreetShopsSection
                area="شارع الربيعي"
                title="شارع الربيعي"
                subtitle="هواتف، شواحن وإكسسوارات — مدخل سريع للقراءة قبل الشراء."
              />
            </div>
          </div>
        </section>

        <section className="container mt-10 sm:mt-20 md:mt-24">
          <Link
            to="/iraq"
            className="group press relative isolate block overflow-hidden rounded-2xl border border-white/10 p-5 text-right shadow-soft-md transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-soft-xl sm:rounded-3xl sm:p-8 md:p-12"
          >
            <img
              aria-hidden
              src={iraqCitiesPano}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-l from-black/55 via-black/25 to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/40 to-transparent"
            />

            <div className="grid gap-4 sm:gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <h2 className="font-display text-balance text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-4xl md:text-5xl">
                  نفس لغة السوق <br className="hidden sm:inline" /> في كل المحافظات.
                </h2>
                <p className="mt-3 max-w-3xl text-pretty text-sm leading-7 text-white/85 sm:mt-4 sm:text-base sm:leading-8">
                  بغداد، أربيل، البصرة، الموصل، النجف، كربلاء، السليمانية، كركوك، بعقوبة،
                  والناصرية ضمن مسار واحد يختصر الوصول من الفكرة إلى المحل.
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-white/20 pt-4 sm:gap-4 md:border-0 md:pt-0">
                <span className="font-display text-base font-bold text-white sm:text-xl">
                  افتح الأطلس
                </span>
                <ArrowLeft className="icon-nudge-x h-4 w-4 translate-x-px text-white sm:h-5 sm:w-5" />
              </div>
            </div>
          </Link>
        </section>

        {/* Brand strip — partner logos */}
        <BrandStrip />

        <section className="relative mt-10 overflow-hidden border-y border-cyan/25 bg-gradient-to-tr from-cyan/14 via-background to-emerald/12 sm:mt-20 md:mt-28">
          <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-emerald/20 blur-3xl" />
          <div className="container py-10 sm:py-16 md:py-20">
            <SectionHeader
              kicker="محلات مختارة"
              title="محلات تستحق أن تبدأ منها"
              seeAll="/results"
              description="قراءة أسرع للمحلات الأوثق والأكثر حضوراً داخل السوق."
            />

            <div className="mt-5 sm:mt-10">
              {loading ? (
                <ShopCardSkeletonGrid count={6} />
              ) : (
                <>
                  <ShopCarousel shops={featured} hideAbove="xl" />

                  <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6">
                    {featured.map((shop, index) => (
                      <div
                        key={shop.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
                      >
                        <ShopCard shop={shop} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden border-y border-cyan/25 bg-gradient-to-bl from-emerald/14 via-background to-cyan/12 sm:mt-20 md:mt-28">
          <div aria-hidden className="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-emerald/20 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
          <div className="container relative py-10 sm:py-16 md:py-20">
            <SectionHeader
              kicker="الوكلاء الرسميون"
              title="اشترِ من المصدر الموثوق"
              description="وكلاء معتمدون رسمياً في العراق — ضمان أصلي وأسعار من المصدر مباشرة."
              seeAll="/brands"
            />

            <div className="mt-10 sm:mt-14">
              <SectionHeader
                kicker="الأعلى تقييماً"
                title="المتاجر الأعلى تقييماً"
                description="مرتبة حسب تقييمات الزبائن الحقيقية وعدد المراجعات."
                seeAll="/results?sort=rating"
              />

              <div className="mt-5 sm:mt-8">
                {loading ? (
                  <ShopCardSkeletonGrid count={6} />
                ) : topRated.length === 0 ? null : (
                  <>
                    <ShopCarousel shops={topRated} hideAbove="xl" />
                    <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6">
                      {topRated.map((shop, index) => (
                        <div
                          key={shop.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
                        >
                          <ShopCard shop={shop} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[4/3] rounded-2xl sm:aspect-[5/4]" />
                  ))}
                </div>
              ) : (
                <>
                  <BrandCarousel brands={brands.slice(0, 6)} hideAbove="lg" />

                  <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
                    {brands.slice(0, 6).map((brand, index) => (
                      <div
                        key={brand.slug}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
                      >
                        <BrandShowcaseCard brand={brand} index={index} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="container mt-10 grid gap-8 sm:mt-16 sm:gap-12 md:mt-20 lg:grid-cols-2 lg:items-start">
          <HowItWorks />
          <div>
            <span className="atlas-kicker">المؤشرات</span>
            <h3 className="font-display mt-4 text-xl font-bold text-foreground sm:text-2xl">آخر قراءة للأطلس</h3>
            <div className="mt-5 sm:mt-6">
              <MetricsStrip />
            </div>
          </div>
        </section>

        {/* Trust / Contact strip — pre-footer */}
        <ContactStrip />
      </main>

      <SiteFooter />
    </>
  );
}
