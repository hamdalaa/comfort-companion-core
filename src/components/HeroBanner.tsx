import { HeroSearch } from "@/components/HeroSearch";
import { HeroDestinations } from "@/components/HeroDestinations";
import { CountUp } from "@/components/CountUp";
import { useDataStore } from "@/lib/dataStore";
import { getPublicStoreCount } from "@/lib/catalogCounts";
import { CITIES } from "@/lib/cityData";
import { ShieldCheck, BadgePercent, Sparkles, Store, MapPin, Package } from "lucide-react";

export function HeroBanner() {
  const { brands, summary } = useDataStore();
  const computedShops = CITIES.reduce((sum, city) => sum + (city.count ?? 0), 0);
  const totalShops = getPublicStoreCount(summary.totalStores, computedShops);

  const trustPills = [
    { icon: ShieldCheck, label: "تقييمات موثوقة", tone: "emerald" as const },
    { icon: BadgePercent, label: "أفضل الأسعار", tone: "cyan" as const },
    { icon: Sparkles, label: "تحديث يومي", tone: "violet" as const },
  ];

  const statCards = [
    {
      icon: Package,
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
      {/* Calm aurora backdrop — barely-there washes, premium and airy */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-cyan/18 blur-[180px]" />
        <div className="absolute -top-20 left-[-12%] h-[560px] w-[560px] rounded-full bg-violet/18 blur-[180px]" />
        <div className="absolute top-[24rem] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-rose/12 blur-[170px]" />

        {/* Ultra-fine dot grid — barely visible texture */}
        <div
          className="absolute inset-0 opacity-[0.32]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--foreground) / 0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 28%, black 30%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 55% at 50% 28%, black 30%, transparent 78%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container relative pt-12 pb-14 sm:pt-16 sm:pb-20 md:pt-20">
        {/* Centered hero content */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow — refined chip */}
          <div
            className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground shadow-xs backdrop-blur-md sm:text-[12px]"
            style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60 animate-ping-soft" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
            </span>
            <span className="text-foreground/80">دليل الإلكترونيات في العراق</span>
          </div>

          {/* Headline — refined scale & rhythm */}
          <h1
            className="animate-fade-in-up font-display mt-5 text-balance text-[clamp(2.1rem,4.6vw,3.85rem)] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:mt-6"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
          >
            كل محلات الإلكترونيات
            <br />
            <span className="bg-gradient-to-l from-violet via-primary to-cyan bg-clip-text text-transparent [text-shadow:_0_0_30px_hsl(var(--primary)/0.08)]">
              بمكان واحد
            </span>
          </h1>

          {/* Subheading — calmer line-height */}
          <p
            className="animate-fade-in-up mx-auto mt-5 max-w-xl text-pretty text-[14px] leading-7 text-muted-foreground sm:mt-6 sm:text-[15.5px] sm:leading-[1.75]"
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

          {/* Trust pills — minimal, single line */}
          <div
            className="animate-fade-in-up mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:mt-7"
            style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
          >
            {trustPills.map((pill) => {
              const tones = toneClasses[pill.tone];
              const Icon = pill.icon;
              return (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground/90 sm:text-[13px]"
                >
                  <Icon className={`h-3.5 w-3.5 ${tones.text}`} strokeWidth={2.4} />
                  <span>{pill.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Stat cards — premium, balanced, restrained */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-2.5 sm:mt-14 sm:gap-4">
          {statCards.map((stat, index) => {
            const tones = toneClasses[stat.tone];
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="animate-fade-in-up group relative flex flex-row-reverse items-center gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/80 px-3.5 py-3.5 shadow-xs backdrop-blur-md transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm sm:px-5 sm:py-5"
                style={{ animationDelay: `${380 + index * 80}ms`, animationFillMode: "backwards" }}
              >
                {/* Subtle inner highlight for premium glass feel */}
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones.bg} ${tones.text} ring-1 ${tones.ring} transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.2} />
                </span>
                <div className="flex min-w-0 flex-col items-end text-right">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-numeric text-lg font-bold leading-none tracking-tight text-foreground sm:text-2xl"
                  />
                  <span className="mt-1.5 text-[10.5px] font-medium tracking-wide text-muted-foreground sm:text-[11.5px]">
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

