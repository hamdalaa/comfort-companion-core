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
    { value: CITIES.length, label: "محافظة" },
  ];

  return (
    <section className="relative isolate bg-background">
      {/* Refined backdrop — layered aurora + ultra-fine dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Aurora glows — three points of color, soft and intentional */}
        <div className="absolute -top-56 right-[-8%] h-[680px] w-[680px] rounded-full bg-primary/20 blur-[180px]" />
        <div className="absolute top-32 left-[-14%] h-[560px] w-[560px] rounded-full bg-violet/15 blur-[180px]" />
        <div className="absolute top-[28rem] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan/10 blur-[160px]" />

        {/* Ultra-fine dot grid — premium, subtle */}
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--foreground) / 0.09) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 30%, black 35%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 50% 30%, black 35%, transparent 80%)",
          }}
        />

        {/* Fine top hairline accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

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

          {/* Inline stats row — bold gradient numerals */}
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
                  className="font-numeric text-2xl font-extrabold leading-none tracking-tight text-foreground sm:text-3xl md:text-4xl"
                />
                <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
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
