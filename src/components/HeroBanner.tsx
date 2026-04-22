import { HeroSearch } from "@/components/HeroSearch";
import { HeroDestinations } from "@/components/HeroDestinations";
import { CountUp } from "@/components/CountUp";
import { useDataStore } from "@/lib/dataStore";
import { getPublicStoreCount } from "@/lib/catalogCounts";
import { CITIES } from "@/lib/cityData";
import { ShieldCheck, Tag, Zap, Store, Map, ShoppingBag, Search } from "lucide-react";

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
      icon: ShoppingBag,
      value: 149854,
      suffix: "+",
      label: "منتج",
      tone: "cyan" as const,
    },
    {
      icon: Store,
      value: totalShops,
      label: "محل مسجل",
      tone: "violet" as const,
    },
    {
      icon: Map,
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
      {/* Bright aurora backdrop — soft cyan / violet / pink, airy & light */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 right-[-8%] h-[640px] w-[640px] rounded-full bg-cyan/25 blur-[160px]" />
        <div className="absolute -top-10 left-[-10%] h-[600px] w-[600px] rounded-full bg-violet/25 blur-[160px]" />
        <div className="absolute top-[20rem] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-rose/18 blur-[150px]" />

        {/* Ultra-fine dot grid — premium texture */}
        <div
          className="absolute inset-0 opacity-[0.45]"
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

      <div className="container relative pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-20">
        {/* Side decorations — 3D bag (right in RTL = start) and 3D pin (left = end) */}
        <SideDecorBag className="pointer-events-none absolute right-[2%] top-[14%] hidden lg:block" />
        <SideDecorPin className="pointer-events-none absolute left-[2%] top-[18%] hidden lg:block" />

        {/* Centered hero content */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div
            className="animate-fade-in-up inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
            style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60 animate-ping-soft" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
            </span>
            <span>دليل الإلكترونيات في العراق</span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up font-display mt-5 text-balance text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold leading-[1.08] tracking-tight text-foreground sm:mt-6"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
          >
            كل محلات الإلكترونيات
            <br />
            <span className="bg-gradient-to-l from-violet via-primary to-cyan bg-clip-text text-transparent">
              بمكان واحد
            </span>
          </h1>

          {/* Subheading */}
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

          {/* Trust pills */}
          <div
            className="animate-fade-in-up mt-6 flex flex-wrap justify-center gap-2 sm:gap-2.5"
            style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
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

        {/* Stat cards */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {statCards.map((stat, index) => {
            const tones = toneClasses[stat.tone];
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="animate-fade-in-up group relative flex flex-row-reverse items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/85 p-4 shadow-xs backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                style={{ animationDelay: `${380 + index * 80}ms`, animationFillMode: "backwards" }}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones.bg} ${tones.text} ring-1 ${tones.ring} sm:h-14 sm:w-14`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
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

/* ---------- Side decorations — 3D-style glass icons (no images) ---------- */

function SideDecorBag({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} animate-float`} style={{ animationDuration: "6s" }}>
      <div className="relative h-44 w-44 xl:h-56 xl:w-56">
        {/* glow halo */}
        <div aria-hidden className="absolute -inset-6 rounded-full bg-gradient-to-br from-cyan/30 via-violet/25 to-rose/20 blur-3xl" />
        {/* glass bag body */}
        <div className="relative flex h-full w-full -rotate-6 items-center justify-center">
          <div className="relative h-[80%] w-[78%] rounded-[1.75rem] border border-white/60 bg-gradient-to-br from-white/70 via-cyan/25 to-violet/30 shadow-[0_30px_60px_-20px_hsl(var(--accent-violet)/0.4)] backdrop-blur-xl">
            {/* highlight */}
            <div className="absolute inset-x-3 top-3 h-12 rounded-[1.25rem] bg-gradient-to-b from-white/70 to-white/0" />
            {/* handle */}
            <div className="absolute -top-7 left-1/2 h-12 w-20 -translate-x-1/2 rounded-t-full border-x-[6px] border-t-[6px] border-white/80" />
            {/* inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-9 w-9 text-primary/70" strokeWidth={1.6} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideDecorPin({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} animate-float`} style={{ animationDuration: "7s", animationDelay: "1.2s" }}>
      <div className="relative h-44 w-44 xl:h-56 xl:w-56">
        {/* glow halo */}
        <div aria-hidden className="absolute -inset-6 rounded-full bg-gradient-to-br from-violet/35 via-primary/25 to-cyan/25 blur-3xl" />
        {/* Stacked circle + tail teardrop pin */}
        <div className="relative flex h-full w-full rotate-6 flex-col items-center">
          <div className="relative mt-2 h-32 w-32 rounded-full border border-white/60 bg-gradient-to-br from-white/70 via-violet/35 to-primary/35 shadow-[0_30px_60px_-20px_hsl(var(--accent-violet)/0.45)] backdrop-blur-xl xl:h-40 xl:w-40">
            <div className="absolute inset-x-3 top-3 h-10 rounded-full bg-gradient-to-b from-white/70 to-white/0" />
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-background/40 backdrop-blur xl:h-12 xl:w-12" />
          </div>
          {/* pin tail */}
          <div className="-mt-3 h-0 w-0 border-x-[16px] border-t-[28px] border-x-transparent border-t-violet/55 xl:border-x-[20px] xl:border-t-[34px]" />
          {/* shadow on ground */}
          <div aria-hidden className="absolute bottom-0 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-foreground/15 blur-md xl:w-32" />
        </div>
      </div>
    </div>
  );
}
