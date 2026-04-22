import { HeroSearch } from "@/components/HeroSearch";
import { HeroDestinations } from "@/components/HeroDestinations";
import { CountUp } from "@/components/CountUp";
import { useDataStore } from "@/lib/dataStore";
import { getPublicStoreCount } from "@/lib/catalogCounts";
import { CITIES } from "@/lib/cityData";
import { ShieldCheck, Tag, Zap, Package, Store, MapPin, TrendingUp, Smartphone, Laptop, Headphones } from "lucide-react";

export function HeroBanner() {
  const { brands, summary } = useDataStore();
  const computedShops = CITIES.reduce((sum, city) => sum + (city.count ?? 0), 0);
  const totalShops = getPublicStoreCount(summary.totalStores, computedShops);

  const trustPills = [
    { icon: ShieldCheck, label: "موثوق", sub: "تقييمات حقيقية", tone: "emerald" as const },
    { icon: Tag, label: "أفضل الأسعار", sub: "قارن ووفّر", tone: "cyan" as const },
    { icon: Zap, label: "تحديث يومي", sub: "معلومات دقيقة", tone: "violet" as const },
  ];

  const statCards = [
    {
      icon: Package,
      value: 149854,
      suffix: "+",
      label: "منتج متاح",
      tone: "cyan" as const,
    },
    {
      icon: Store,
      value: totalShops,
      label: "محل مُسجّل",
      tone: "violet" as const,
    },
    {
      icon: MapPin,
      value: CITIES.length,
      label: "محافظات",
      tone: "emerald" as const,
    },
  ];

  const toneClasses: Record<"cyan" | "violet" | "emerald" | "rose", { bg: string; text: string; ring: string }> = {
    cyan: { bg: "bg-cyan-soft", text: "text-cyan", ring: "ring-cyan/20" },
    violet: { bg: "bg-violet-soft", text: "text-violet", ring: "ring-violet/20" },
    emerald: { bg: "bg-emerald-soft", text: "text-emerald", ring: "ring-emerald/20" },
    rose: { bg: "bg-rose-soft", text: "text-rose", ring: "ring-rose/20" },
  };

  return (
    <section className="relative isolate bg-background">
      {/* Vibrant aurora backdrop — sky blues, violets, soft pink */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] h-[720px] w-[720px] rounded-full bg-cyan/40 blur-[170px]" />
        <div className="absolute -top-20 left-[-12%] h-[680px] w-[680px] rounded-full bg-violet/45 blur-[170px]" />
        <div className="absolute top-[18rem] left-1/3 h-[520px] w-[520px] rounded-full bg-rose/35 blur-[160px]" />
        <div className="absolute top-[8rem] right-1/4 h-[400px] w-[400px] rounded-full bg-primary/35 blur-[150px]" />

        {/* Ultra-fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 30%, black 35%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 50% 30%, black 35%, transparent 80%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container relative pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-24">
        {/* Two-column split on lg+, single column on mobile */}
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
          {/* RIGHT column in RTL = visual / LEFT in source */}
          <div className="order-1 lg:order-2">
            <HeroVisual />
          </div>

          {/* LEFT column in RTL = text */}
          <div className="order-2 text-center lg:order-1 lg:text-right">
            <div
              className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-xs backdrop-blur sm:text-xs"
              style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60 animate-ping-soft" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              <span className="tracking-[0.16em]">دليل الإلكترونيات في العراق</span>
            </div>

            <h1
              className="animate-fade-in-up font-display mt-5 text-balance text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-foreground sm:mt-6"
              style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
            >
              كل محلات الإلكترونيات
              <br />
              <span className="bg-gradient-to-l from-violet via-primary to-cyan bg-clip-text text-transparent">
                بمكان واحد
              </span>
            </h1>

            <p
              className="animate-fade-in-up mt-5 max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:mx-0 mx-auto"
              style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
            >
              قارن الأسعار، شوف العنوان والتقييم، وتواصل مع المحل مباشرةً —
              من شارع الصناعة لحد البصرة وأربيل.
            </p>

            {/* Trust pills */}
            <div
              className="animate-fade-in-up mt-6 flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:justify-start"
              style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
            >
              {trustPills.map((pill) => {
                const tones = toneClasses[pill.tone];
                const Icon = pill.icon;
                return (
                  <div
                    key={pill.label}
                    className="group flex items-center gap-2 rounded-full border border-border/60 bg-card/80 py-1.5 pl-3 pr-1.5 shadow-xs backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full ${tones.bg} ${tones.text} ring-1 ${tones.ring}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[11px] font-semibold text-foreground sm:text-xs">{pill.label}</span>
                      <span className="text-[10px] text-muted-foreground sm:text-[10.5px]">{pill.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search bar — full width below the split */}
        <div
          className="animate-fade-in-up relative z-30 mx-auto mt-10 max-w-3xl sm:mt-12"
          style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
        >
          <HeroSearch />
        </div>

        {/* Stat cards */}
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
          {statCards.map((stat, index) => {
            const tones = toneClasses[stat.tone];
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="animate-fade-in-up group relative flex flex-row-reverse items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-4 shadow-xs backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ animationDelay: `${380 + index * 80}ms`, animationFillMode: "backwards" }}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones.bg} ${tones.text} ring-1 ${tones.ring}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex min-w-0 flex-col items-end text-right">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-numeric text-2xl font-extrabold leading-none tracking-tight text-foreground sm:text-3xl"
                  />
                  <span className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Destination tiles */}
        <HeroDestinations />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------
 * HeroVisual — colorful, image-free composition
 * Three layered aurora blobs + floating "149K+ منتج" chip + sparkle.
 * Pure CSS / SVG — zero network cost.
 * -------------------------------------------------------------- */
function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-md sm:max-w-lg lg:max-w-none">
      {/* Outer aurora halo — vibrant, no plate border */}
      <div aria-hidden className="absolute inset-0 overflow-visible">
        {/* Big violet/pink heart-shaped aurora behind devices */}
        <div className="absolute inset-x-4 inset-y-6 rounded-[3rem] bg-gradient-to-br from-violet/40 via-rose/30 to-cyan/40 blur-3xl" />
        <div className="absolute -top-4 right-6 h-64 w-64 rounded-full bg-violet/45 blur-3xl animate-float" />
        <div className="absolute bottom-4 left-2 h-72 w-72 rounded-full bg-rose/40 blur-3xl animate-float" style={{ animationDelay: "1.4s" }} />
        <div className="absolute top-10 left-1/3 h-56 w-56 rounded-full bg-cyan/45 blur-3xl animate-float" style={{ animationDelay: "2.6s" }} />
      </div>

      {/* Stylized 3D device stack — mimics phone + laptop + earbuds composition */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Laptop slab */}
        <div className="relative h-[58%] w-[78%] -rotate-3 rounded-[1.5rem] bg-gradient-to-br from-primary via-violet to-violet/80 shadow-[0_30px_60px_-20px_hsl(var(--accent-violet)/0.55)] ring-1 ring-white/15">
          <div className="absolute inset-2 rounded-[1.1rem] bg-gradient-to-br from-foreground/85 to-foreground/65 ring-1 ring-white/10" />
          <div className="absolute inset-x-0 bottom-0 h-2 rounded-b-[1.5rem] bg-gradient-to-r from-primary/60 via-cyan/60 to-violet/60" />
          {/* screen highlight icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Laptop className="h-12 w-12 text-white/30" strokeWidth={1.2} />
          </div>
        </div>

        {/* Phone — overlapping front-left */}
        <div className="absolute right-[6%] top-[14%] h-[55%] w-[22%] rotate-6 rounded-[1.25rem] bg-gradient-to-br from-cyan via-primary to-violet shadow-[0_24px_50px_-18px_hsl(var(--accent-cyan)/0.6)] ring-1 ring-white/20">
          <div className="absolute inset-1.5 rounded-[1rem] bg-gradient-to-br from-foreground/85 to-foreground/65 ring-1 ring-white/10" />
          <div className="absolute left-1/2 top-2 h-1 w-6 -translate-x-1/2 rounded-full bg-foreground/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Smartphone className="h-7 w-7 text-white/35" strokeWidth={1.2} />
          </div>
        </div>

        {/* Earbuds case — bottom-left */}
        <div className="absolute bottom-[8%] left-[10%] flex h-16 w-16 -rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose via-violet to-primary shadow-[0_20px_40px_-15px_hsl(var(--accent-rose)/0.55)] ring-1 ring-white/20 sm:h-20 sm:w-20">
          <Headphones className="h-7 w-7 text-white/80" strokeWidth={1.5} />
        </div>
      </div>

      {/* Floating chip — top-left of visual (matches reference) */}
      <div className="absolute left-2 top-2 flex items-center gap-2 rounded-2xl border border-border/60 bg-card/90 px-3 py-2 shadow-md backdrop-blur-xl animate-float sm:left-4 sm:top-4" style={{ animationDelay: "0.4s" }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-soft text-cyan ring-1 ring-cyan/20">
          <Package className="h-4 w-4" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-numeric text-sm font-bold text-foreground">+149K</span>
          <span className="text-[10px] text-muted-foreground">منتج متاح</span>
        </div>
        {/* mini sparkline */}
        <svg viewBox="0 0 40 16" className="ml-1 h-4 w-10 text-primary">
          <path d="M0 12 L8 10 L14 13 L20 6 L26 9 L32 4 L40 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Floating chip — bottom-right */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded-2xl border border-border/60 bg-card/90 px-3 py-2 shadow-md backdrop-blur-xl animate-float sm:bottom-4 sm:right-4" style={{ animationDelay: "1.6s" }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-soft text-emerald ring-1 ring-emerald/20">
          <TrendingUp className="h-4 w-4" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-semibold text-foreground">أسعار محدثة</span>
          <span className="text-[10px] text-muted-foreground">يومياً</span>
        </div>
      </div>
    </div>
  );
}
