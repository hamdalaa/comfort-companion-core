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
      {/* Creative premium backdrop — layered mesh, grid, and aurora glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Soft aurora blobs */}
        <div className="absolute -top-40 -right-32 h-[560px] w-[560px] rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute top-32 -left-40 h-[480px] w-[480px] rounded-full bg-violet/20 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-cyan/20 blur-[140px]" />

        {/* Subtle dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 80%)",
          }}
        />

        {/* Diagonal sheen */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Bottom fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
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
