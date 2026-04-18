import { Link, useParams } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { useDataStore } from "@/lib/dataStore";
import { OFFICIAL_DEALER_BRANCHES } from "@/lib/officialDealers";
import { getBrandLogo } from "@/lib/brandLogos";
import { getBrandBackground } from "@/lib/brandBackgrounds";
import {
  ChevronLeft,
  ExternalLink,
  Phone,
  Home,
  ShieldCheck,
  MapPin,
  Store,
  Globe,
  Building2,
  Package,
} from "lucide-react";

const Brand = () => {
  const { slug } = useParams<{ slug: string }>();
  const { brands, products } = useDataStore();
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <TopNav />
        <main className="flex-1 container py-12">
          <EmptyState
            title="البراند غير موجود"
            action={
              <Button asChild variant="outline">
                <Link to="/brands">كل البراندات</Link>
              </Button>
            }
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const related = products.filter(
    (p) => p.brand?.toLowerCase() === brand.brandName.toLowerCase(),
  );
  const branches = OFFICIAL_DEALER_BRANCHES.filter((b) => b.brandSlug === brand.slug);
  const isVerified = brand.verificationStatus === "verified";
  const logo = getBrandLogo(brand.slug);
  const background = getBrandBackground(brand.slug);
  const initial = brand.brandName.slice(0, 1);
  const isApple = brand.slug === "apple";
  const isSamsung = brand.slug === "samsung";

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,hsl(var(--surface))_0%,hsl(var(--background))_14%,hsl(var(--surface))_100%)]">
      <TopNav />

      {/* Breadcrumbs */}
      <div className="bg-background border-b border-border">
        <div className="container flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary">
            <Home className="h-3 w-3" />
            الرئيسية
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link to="/brands" className="hover:text-primary">
            وكلاء البراندات
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="text-foreground">{brand.brandName}</span>
        </div>
      </div>

      {/* HERO — split layout: image showcase + glass content card */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container relative py-8 md:py-12">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_1fr]">
            {/* LEFT: Premium image showcase */}
            {background ? (
              <div className="group relative order-2 overflow-hidden rounded-[2rem] border border-border/60 shadow-soft-xl lg:order-1 min-h-[280px] md:min-h-[360px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${background})` }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden />
                <div className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md ring-1 ring-white/20">
                  <Store className="h-3.5 w-3.5" />
                  معرض رسمي
                </div>
              </div>
            ) : (
              <div className="relative order-2 overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/15 via-accent/10 to-background shadow-soft-xl lg:order-1 min-h-[280px] md:min-h-[360px]">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-background shadow-soft-lg">
                    {logo ? (
                      <img src={logo} alt={brand.brandName} className="h-full w-full object-contain p-4" />
                    ) : (
                      <span className="font-display text-5xl font-bold">{initial}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT: Glass content card — refined */}
            <div className="relative order-1 flex flex-col justify-center gap-5 rounded-[2rem] border border-border/60 bg-card/85 p-6 shadow-soft-xl backdrop-blur-md md:p-8 lg:order-2">
              {/* Top eyebrow: verified pill */}
              {isVerified && (
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-success/20 to-success/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-success ring-1 ring-success/40">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    بائع معتمد
                  </span>
                </div>
              )}

              {/* Brand name / logo */}
              <div>
                {isApple ? (
                  <h1 className="leading-none">
                    <span className="sr-only">Apple</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 814 1000"
                      aria-hidden
                      className="h-14 w-auto md:h-16 lg:h-20 fill-foreground"
                    >
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                    </svg>
                  </h1>
                ) : isSamsung ? (
                  <h1 className="leading-none">
                    <span className="sr-only">Samsung</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="h-10 w-auto md:h-12 lg:h-14 fill-[#1428A0] dark:fill-foreground"
                    >
                      <path d="M19.8166 10.2808l.0459 2.6934h-.023l-.7793-2.6934h-1.2837v3.3925h.8481l-.0458-2.785h.023l.8366 2.785h1.2264v-3.3925zm-16.149 0l-.6418 3.427h.9284l.4699-3.1175h.0229l.4585 3.1174h.9169l-.6304-3.4269zm5.1805 0l-.424 2.6132h-.023l-.424-2.6132H6.5788l-.0688 3.427h.8596l.023-3.0832h.0114l.573 3.0831h.8711l.5731-3.083h.023l.0228 3.083h.8596l-.0802-3.4269zm-7.2664 2.4527c.0343.0802.0229.1949.0114.2522-.0229.1146-.1031.2292-.3324.2292-.2177 0-.3438-.126-.3438-.3095v-.3323H0v.2636c0 .7679.6074.9971 1.2493.9971.6189 0 1.1346-.2178 1.2149-.7794.0458-.298.0114-.4928 0-.5616-.1605-.722-1.467-.9283-1.5588-1.3295-.0114-.0688-.0114-.1375 0-.1834.023-.1146.1032-.2292.3095-.2292.2063 0 .321.126.321.3095v.2063h.8595v-.2407c0-.745-.6762-.8596-1.1576-.8596-.6074 0-1.1117.2063-1.2034.7564-.023.149-.0344.2866.0114.4585.1376.7106 1.467.9283 1.5588 1.3295m11.152 0c.0343.0803.0228.1834.0114.2522-.023.1146-.1032.2292-.3324.2292-.2178 0-.3438-.126-.3438-.3095v-.3323h-.917v.2636c0 .7564.596.9857 1.2379.9857.6189 0 1.1232-.2063 1.2034-.7794.0459-.298.0115-.4814 0-.5616-.1375-.7106-1.4327-.9284-1.5243-1.318-.0115-.0688-.0115-.1376 0-.1835.0229-.1146.1031-.2292.3094-.2292.1948 0 .321.126.321.3095v.2063h.848v-.2407c0-.745-.6647-.8596-1.146-.8596-.6075 0-1.1004.1948-1.192.7564-.023.149-.023.2866.0114.4585.1376.7106 1.341.9054 1.513 1.3524m2.8882.4585c.2407 0 .3094-.1605.3323-.2522.0115-.0343.0115-.0917.0115-.126v-2.533h.871v2.4642c0 .0688 0 .1948-.0114.2292-.0573.6419-.5616.8482-1.192.8482-.6303 0-1.1346-.2063-1.192-.8482 0-.0344-.0114-.1604-.0114-.2292v-2.4642h.871v2.533c0 .0458 0 .0916.0115.126 0 .0917.0688.2522.3095.2522m7.1518-.0344c.2522 0 .3324-.1605.3553-.2522.0115-.0343.0115-.0917.0115-.126v-.4929h-.3553v-.5043H24v.917c0 .0687 0 .1145-.0115.2292-.0573.6303-.596.8481-1.2034.8481-.6075 0-1.1461-.2178-1.2034-.8481-.0115-.1147-.0115-.1605-.0115-.2293v-1.444c0-.0574.0115-.172.0115-.2293.0802-.6419.596-.8482 1.2034-.8482s1.1347.2063 1.2034.8482c.0115.1031.0115.2292.0115.2292v.1146h-.8596v-.1948s0-.0803-.0115-.1261c-.0114-.0802-.0802-.2521-.3438-.2521-.2521 0-.321.1604-.3438.2521-.0115.0458-.0115.1032-.0115.1605v1.5702c0 .0458 0 .0916.0115.126 0 .0917.0917.2522.3323.2522" />
                    </svg>
                  </h1>
                ) : (
                  <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                    {brand.brandName}
                  </h1>
                )}
                {/* Dealer meta — small caps style */}
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Store className="h-3 w-3 text-primary" />
                  الموزع المعتمد
                </div>
                <div className="mt-1 text-sm font-medium text-foreground/90 leading-snug">
                  {brand.dealerName}
                </div>
              </div>

              {/* Coverage description */}
              <p className="text-sm leading-relaxed text-foreground/75 border-r-2 border-primary/40 pr-3">
                {brand.coverage}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {brand.website && (
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-soft-lg rounded-xl"
                  >
                    <a href={brand.website} target="_blank" rel="noreferrer noopener">
                      <Globe className="h-4 w-4" />
                      الموقع الرسمي
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </Button>
                )}
                {brand.contactPhones.map((ph) => (
                  <Button key={ph} asChild variant="outline" size="lg" className="gap-2 rounded-xl">
                    <a href={`tel:${ph}`} dir="ltr">
                      <Phone className="h-4 w-4" />
                      {ph}
                    </a>
                  </Button>
                ))}
              </div>

              {/* Cities */}
              {brand.cities.length > 0 && (
                <div className="border-t border-border/60 pt-4">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    متوفر في
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {brand.cities.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/15"
                      >
                        <MapPin className="h-3 w-3" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats — full width below */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <StatTile icon={Building2} value={branches.length} label="فرع رسمي" />
            <StatTile icon={MapPin} value={brand.cities.length} label="مدينة" />
            <StatTile icon={Package} value={related.length} label="منتج مفهرس" />
            <StatTile
              icon={ShieldCheck}
              value={isVerified ? "✓" : "—"}
              label={isVerified ? "موثّق" : "قيد التحقق"}
              accent={isVerified}
            />
          </div>
        </div>
      </section>

      <main className="flex-1 container py-6 space-y-6 md:py-8">
        {/* OFFICIAL BRANCHES */}
        {branches.length > 0 && (
          <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-soft-lg backdrop-blur-sm md:p-6">
            <header className="mb-4 flex items-start justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  الفروع الرسمية
                  <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">
                    {branches.length}
                  </span>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  وكلاء معتمدون من {brand.brandName} — مصدر القائمة: الموقع الرسمي، تحقق عبر Google Places.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <article
                  key={b.id}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/85 transition-all duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-soft-xl"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {b.mainImage ? (
                      <img
                        src={b.mainImage}
                        alt={b.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10">
                        <Store className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-success/90 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-success-foreground shadow">
                      <ShieldCheck className="h-3 w-3" />
                      رسمي
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 p-3.5 gap-2">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2">{b.name}</h3>

                    {b.address && (
                      <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                        <span className="line-clamp-2">{b.address}</span>
                      </div>
                    )}

                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      <Link
                        to={`/shop-view/${b.id}`}
                        className="inline-flex flex-1 min-w-0 items-center justify-center gap-1 rounded-md bg-primary text-primary-foreground px-2.5 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        تفاصيل المحل
                      </Link>
                      {b.googleMapsUrl && (
                        <a
                          href={b.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="فتح الخريطة"
                          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {b.phone && (
                        <a
                          href={`tel:${b.phone.replace(/\s+/g, "")}`}
                          aria-label="اتصال"
                          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* PRODUCTS */}
        <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-soft-lg backdrop-blur-sm md:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold border-b border-border pb-3">
            <Package className="h-5 w-5 text-primary" />
            منتجات {brand.brandName} على تايه
            {related.length > 0 && (
              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">
                {related.length}
              </span>
            )}
          </h2>
          {related.length === 0 ? (
            <EmptyState
              title="ماكو منتجات مفهرسة لهذا البراند بعد"
              description="رح نضيف منتجات قريباً من المحلات والوكلاء الرسميين."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={{ ...p, score: 0 }} />
              ))}
            </div>
          )}
        </section>

        {/* OTHER BRANDS */}
        <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-soft-lg backdrop-blur-sm md:p-6">
          <h2 className="mb-4 text-xl font-bold border-b border-border pb-3">براندات أخرى</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {brands
              .filter((b) => b.slug !== brand.slug)
              .map((b) => {
                const bBranches = OFFICIAL_DEALER_BRANCHES.filter(
                  (x) => x.brandSlug === b.slug,
                ).length;
                const bLogo = getBrandLogo(b.slug);
                return (
                  <Link
                    key={b.slug}
                    to={`/brand/${b.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-background/85 p-3 transition-all hover:border-primary/35 hover:shadow-soft-lg"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background overflow-hidden border border-border">
                      {bLogo ? (
                        <img
                          src={bLogo}
                          alt={b.brandName}
                          loading="lazy"
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-primary font-display text-lg font-bold text-primary-foreground">
                          {b.brandName.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-sm font-semibold truncate">
                        {b.brandName}
                        {b.verificationStatus === "verified" && (
                          <ShieldCheck className="h-3 w-3 text-success shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {bBranches > 0 ? `${bBranches} فرع رسمي` : b.dealerName}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

function StatTile({
  icon: Icon,
  value,
  label,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl border bg-background/80 p-3 backdrop-blur transition-colors ${
        accent ? "border-success/40" : "border-border"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
          accent ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-xl font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground truncate">{label}</div>
      </div>
    </div>
  );
}

export default Brand;
