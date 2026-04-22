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
      {/* outer soft halo */}
      <div aria-hidden className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-cyan/10 via-primary/5 to-violet/10 blur-2xl" />

      {/* glass plate */}
      <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] border border-white/40 bg-card/40 shadow-panel backdrop-blur-2xl">
        {/* aurora blobs inside the plate */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-cyan/50 blur-3xl animate-float" />
          <div className="absolute top-1/3 -left-12 h-72 w-72 rounded-full bg-violet/50 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />
          <div className="absolute -bottom-10 right-1/4 h-60 w-60 rounded-full bg-rose/40 blur-3xl animate-float" style={{ animationDelay: "2.4s" }} />
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 blur-2xl" />
        </div>

        {/* fine grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 90%)",
          }}
        />

        {/* center sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card/80 ring-1 ring-white/50 backdrop-blur-xl shadow-md">
            <Sparkles className="h-9 w-9 text-primary" />
          </div>
        </div>

        {/* floating chip — top */}
        <div className="absolute right-5 top-5 flex items-center gap-2 rounded-2xl border border-white/60 bg-card/90 px-3 py-2 shadow-md backdrop-blur-xl animate-float" style={{ animationDelay: "0.4s" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-soft text-cyan ring-1 ring-cyan/20">
            <Package className="h-4 w-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-numeric text-sm font-bold text-foreground">+149K</span>
            <span className="text-[10px] text-muted-foreground">منتج متاح</span>
          </div>
        </div>

        {/* floating chip — bottom */}
        <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-2xl border border-white/60 bg-card/90 px-3 py-2 shadow-md backdrop-blur-xl animate-float" style={{ animationDelay: "1.6s" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-soft text-emerald ring-1 ring-emerald/20">
            <TrendingUp className="h-4 w-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-semibold text-foreground">أسعار محدثة</span>
            <span className="text-[10px] text-muted-foreground">يومياً</span>
          </div>
        </div>

        {/* floating chip — middle right (cities) */}
        <div className="absolute bottom-1/3 right-3 hidden items-center gap-2 rounded-2xl border border-white/60 bg-card/90 px-3 py-2 shadow-md backdrop-blur-xl animate-float sm:flex" style={{ animationDelay: "2.2s" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-soft text-violet ring-1 ring-violet/20">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-semibold text-foreground">10 محافظات</span>
            <span className="text-[10px] text-muted-foreground">تغطية كاملة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
