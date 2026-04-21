import { HeroSearch } from "@/components/HeroSearch";
import { HeroDestinations } from "@/components/HeroDestinations";
import { CountUp } from "@/components/CountUp";
import { useDataStore } from "@/lib/dataStore";
import { getPublicStoreCount } from "@/lib/catalogCounts";
import { CITIES } from "@/lib/cityData";

export function HeroBanner() {
  const { brands, summary } = useDataStore();
  const computedShops = CITIES.reduce((sum, city) => sum + (city.count ?? 0), 0);
  const totalShops = getPublicStoreCount(summary.totalStores, computedShops);

  const stats = [
    { value: 150000, label: "منتج", suffix: "+" },
    { value: totalShops, label: "محل ميداني" },
    { value: brands.length, label: "وكيل وبراند" },
    { value: CITIES.length, label: "محافظة" },
  ];

  return (
    <section className="relative isolate bg-background">
      {/* Modern clean backdrop — soft mesh + minimal grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Two soft, well-placed glows — calm, not busy */}
        <div className="absolute -top-48 right-[-10%] h-[620px] w-[620px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute top-40 left-[-12%] h-[520px] w-[520px] rounded-full bg-violet/12 blur-[170px]" />

        {/* Crisp minimal grid — fades into center */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--border) / 0.6) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 75%)",
          }}
        />

        {/* Fine top hairline accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Smooth bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container relative pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow — minimal text label, no chip */}
          <div
            className="animate-fade-in-up flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:text-xs"
            style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
          >
            <span className="h-1 w-1 rounded-full bg-emerald" />
            <span>دليل الإلكترونيات في العراق</span>
          </div>

          {/* Headline — quiet, confident, single weight */}
          <h1
            className="animate-fade-in-up font-display mt-5 text-balance text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[1.08] tracking-tight text-foreground sm:mt-7"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
          >
            كل محلات الإلكترونيات
            <br />
            <span className="text-primary">بمكان واحد</span>
          </h1>

          {/* Subheading — short, scannable */}
          <p
            className="animate-fade-in-up mx-auto mt-5 max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8"
            style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
          >
            قارن الأسعار، شوف العنوان والتقييم، وتواصل مع المحل مباشرةً —
            من شارع الصناعة لحد البصرة وأربيل.
          </p>

          {/* Search */}
          <div
            className="animate-fade-in-up relative z-30 mx-auto mt-8 max-w-2xl sm:mt-10"
            style={{ animationDelay: "240ms", animationFillMode: "backwards" }}
          >
            <HeroSearch />
          </div>

          {/* Inline stats row — compact, refined, no cards */}
          <div className="mt-10 flex items-center justify-center divide-x divide-border/60 sm:mt-12 [direction:ltr]">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="animate-fade-in-up flex min-w-0 flex-col items-center px-5 sm:px-8"
                style={{ animationDelay: `${320 + index * 80}ms`, animationFillMode: "backwards" }}
              >
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-numeric text-xl font-semibold leading-none text-foreground sm:text-2xl md:text-3xl"
                />
                <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Destination tiles */}
        <HeroDestinations />
      </div>
    </section>
  );
}
