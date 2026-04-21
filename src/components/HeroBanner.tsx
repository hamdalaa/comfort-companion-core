import { Sparkles } from "lucide-react";
import { HeroSearch } from "@/components/HeroSearch";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { CountUp } from "@/components/CountUp";
import { useDataStore } from "@/lib/dataStore";
import { getPublicStoreCount } from "@/lib/catalogCounts";
import { CITIES } from "@/lib/cityData";
import baghdadMap from "@/assets/hero-baghdad-map.jpg";

export function HeroBanner() {
  const { brands, summary } = useDataStore();
  const computedShops = CITIES.reduce((sum, city) => sum + (city.count ?? 0), 0);
  const totalShops = getPublicStoreCount(summary.totalStores, computedShops);

  const stats = [
    { value: totalShops, label: "محل ميداني" },
    { value: brands.length, label: "وكيل وبراند" },
    { value: CITIES.length, label: "محافظة" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Bright airy base — soft cream wash */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-b from-primary-soft/30 via-background to-background" />

      {/* Baghdad street map — very faint, no blend mode (mobile-safe) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-25 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url(${baghdadMap})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      {/* Soft glow accents — light, no heavy blobs */}
      <div className="pointer-events-none absolute -top-40 right-1/4 -z-20 h-[420px] w-[420px] rounded-full bg-primary/8 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 -left-32 -z-20 h-[380px] w-[380px] rounded-full bg-primary-soft/30 blur-[140px]" />

      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative pt-10 pb-14 sm:pt-20 sm:pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/80 px-3.5 py-1.5 text-[11px] font-semibold text-primary shadow-soft backdrop-blur-md sm:text-xs"
            style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 animate-pulse" />
            <span>أكبر دليل إلكترونيات بالعراق · مُحدَّث يومياً</span>
            <span className="mx-1 h-1 w-1 rounded-full bg-emerald" />
            <span className="text-primary/70">حي الآن</span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up font-display mt-6 text-balance text-[clamp(2.25rem,6.4vw,5.5rem)] font-medium leading-[1.05] tracking-tight text-foreground sm:mt-8"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
          >
            كل محلات الإلكترونيات
            <br className="hidden sm:inline" />
            <span className="font-bold bg-gradient-to-r from-primary via-primary to-emerald bg-clip-text text-transparent"> بمكان واحد</span>
            <span className="text-primary">.</span>
          </h1>

          {/* Service explanation */}
          <p
            className="animate-fade-in-up mx-auto mt-5 max-w-[62ch] text-pretty text-[13px] leading-7 text-muted-foreground sm:mt-7 sm:text-base sm:leading-8"
            style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
          >
            دور على أي منتج إلكتروني — موبايل، لابتوب، شاشة، إكسسوار — وشوف
            <span className="text-foreground"> أسعاره عند كل المحلات</span>،
            مع <span className="text-foreground">العنوان والتقييمات وتلفون المحل</span>،
            من شارع الصناعة لحد البصرة وأربيل.
          </p>

          {/* Search */}
          <div
            className="animate-fade-in-up relative z-30 mx-auto mt-7 max-w-2xl sm:mt-10"
            style={{ animationDelay: "240ms", animationFillMode: "backwards" }}
          >
            <HeroSearch />
          </div>

          <div className="mt-5 hidden items-center justify-center gap-2 text-[11px] text-muted-foreground sm:flex">
            <span>اضغط</span>
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-numeric text-[10px] font-semibold shadow-soft">⌘</kbd>
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-numeric text-[10px] font-semibold shadow-soft">K</kbd>
            <span>لفتح البحث الذكي من أي مكان</span>
          </div>
        </div>

        {/* Hero slideshow — replaces the 3 static destination tiles */}
        <HeroSlideshow />

        {/* Stats — premium light cards */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-3 gap-2 sm:gap-4 md:mt-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="animate-fade-in-up relative flex min-w-0 flex-col items-center justify-center rounded-3xl border border-border bg-card/80 px-2 py-4 text-center shadow-soft-md backdrop-blur-md transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card hover:shadow-soft-xl sm:px-6 sm:py-7 md:px-8 md:py-8"
              style={{ animationDelay: `${420 + index * 80}ms`, animationFillMode: "backwards" }}
            >
              <CountUp
                value={stat.value}
                className="font-numeric text-2xl font-semibold leading-none bg-gradient-to-b from-primary to-violet bg-clip-text text-transparent sm:text-4xl md:text-5xl lg:text-6xl"
              />
              <div className="mt-2 line-clamp-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px] sm:tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
