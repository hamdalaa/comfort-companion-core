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
    { icon: ShieldCheck, label: "تقييمات موثوقة", tone: "emerald" as const },
    { icon: Tag, label: "أفضل الأسعار", tone: "cyan" as const },
    { icon: Zap, label: "تحديث يومي", tone: "violet" as const },
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

      <div className="container relative pt-10 pb-12 sm:pt-14 sm:pb-16 md:pt-16">
        {/* Side decorations — kept small & far from text safe-zone */}
        <SideDecorBag className="pointer-events-none absolute right-[1%] top-[22%] hidden xl:block" />
        <SideDecorPin className="pointer-events-none absolute left-[1%] top-[26%] hidden xl:block" />

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
            className="animate-fade-in-up font-display mt-4 text-balance text-[clamp(2rem,4.8vw,4rem)] font-bold leading-[1.08] tracking-tight text-foreground sm:mt-5"
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
            className="animate-fade-in-up mx-auto mt-4 max-w-xl text-pretty text-[13.5px] leading-7 text-muted-foreground sm:mt-5 sm:text-[15px] sm:leading-8"
            style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
          >
            قارن الأسعار، شوف العنوان والتقييم، وتواصل مع المحل مباشرةً —
            من شارع الصناعة لحد البصرة وأربيل.
          </p>

          {/* Search */}
          <div
            className="animate-fade-in-up relative z-30 mx-auto mt-7 max-w-2xl sm:mt-8"
            style={{ animationDelay: "240ms", animationFillMode: "backwards" }}
          >
            <HeroSearch />
          </div>

          {/* Trust pills — single line, compact */}
          <div
            className="animate-fade-in-up mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 sm:mt-6"
            style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
          >
            {trustPills.map((pill) => {
              const tones = toneClasses[pill.tone];
              const Icon = pill.icon;
              return (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground sm:text-[13px]"
                >
                  <Icon className={`h-3.5 w-3.5 ${tones.text}`} strokeWidth={2.2} />
                  <span>{pill.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Stat cards — refined, denser */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-2 sm:mt-12 sm:gap-3">
          {statCards.map((stat, index) => {
            const tones = toneClasses[stat.tone];
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="animate-fade-in-up group relative flex flex-row-reverse items-center gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/85 px-3 py-3 shadow-xs backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm sm:px-4 sm:py-4"
                style={{ animationDelay: `${380 + index * 80}ms`, animationFillMode: "backwards" }}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones.bg} ${tones.text} ring-1 ${tones.ring} sm:h-11 sm:w-11`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="flex min-w-0 flex-col items-end text-right">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-numeric text-base font-extrabold leading-none tracking-tight text-foreground sm:text-2xl"
                  />
                  <span className="mt-1 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
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
      <div className="relative h-32 w-32 xl:h-40 xl:w-40">
        {/* glow halo */}
        <div aria-hidden className="absolute -inset-4 rounded-full bg-gradient-to-br from-cyan/25 via-violet/20 to-rose/15 blur-3xl" />
        {/* glass bag body */}
        <div className="relative flex h-full w-full -rotate-6 items-center justify-center">
          <div className="relative h-[80%] w-[78%] rounded-[1.5rem] border border-white/50 bg-gradient-to-br from-white/60 via-cyan/20 to-violet/25 shadow-[0_20px_45px_-18px_hsl(var(--accent-violet)/0.35)] backdrop-blur-xl">
            {/* highlight */}
            <div className="absolute inset-x-3 top-3 h-8 rounded-[1.25rem] bg-gradient-to-b from-white/60 to-white/0" />
            {/* handle */}
            <div className="absolute -top-5 left-1/2 h-9 w-14 -translate-x-1/2 rounded-t-full border-x-[5px] border-t-[5px] border-white/70" />
            {/* inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary/70" strokeWidth={1.8} />
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
      <div className="relative h-32 w-32 xl:h-40 xl:w-40">
        {/* glow halo */}
        <div aria-hidden className="absolute -inset-4 rounded-full bg-gradient-to-br from-violet/30 via-primary/20 to-cyan/20 blur-3xl" />
        {/* Stacked circle + tail teardrop pin */}
        <div className="relative flex h-full w-full rotate-6 flex-col items-center">
          <div className="relative mt-1 h-22 w-22 rounded-full border border-white/50 bg-gradient-to-br from-white/60 via-violet/30 to-primary/30 shadow-[0_20px_45px_-18px_hsl(var(--accent-violet)/0.4)] backdrop-blur-xl xl:h-28 xl:w-28" style={{ height: "5.5rem", width: "5.5rem" }}>
            <div className="absolute inset-x-2 top-2 h-7 rounded-full bg-gradient-to-b from-white/60 to-white/0" />
            <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-background/40 backdrop-blur xl:h-9 xl:w-9" />
          </div>
          {/* pin tail */}
          <div className="-mt-2 h-0 w-0 border-x-[12px] border-t-[20px] border-x-transparent border-t-violet/45 xl:border-x-[14px] xl:border-t-[24px]" />
          {/* shadow on ground */}
          <div aria-hidden className="absolute bottom-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-foreground/15 blur-md xl:w-20" />
        </div>
      </div>
    </div>
  );
}
