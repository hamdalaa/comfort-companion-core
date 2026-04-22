import { HeroSearch } from "@/components/HeroSearch";
import { HeroDestinations } from "@/components/HeroDestinations";
import { CountUp } from "@/components/CountUp";
import { useDataStore } from "@/lib/dataStore";
import { getPublicStoreCount } from "@/lib/catalogCounts";
import { CITIES } from "@/lib/cityData";
import { ShieldCheck, BadgePercent, Sparkles, Store, MapPin, Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section className="relative isolate overflow-hidden bg-background">
      {/* ============== Modern Tech backdrop — Linear/Vercel inspired ============== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Top gradient wash — single, soft, off-center */}
        <div className="absolute -top-32 left-1/2 h-[680px] w-[1200px] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-primary/[0.10] via-violet/[0.06] to-transparent blur-3xl" />
        {/* Side glows — barely-there */}
        <div className="absolute top-20 right-[-8%] h-[420px] w-[420px] rounded-full bg-cyan/[0.08] blur-[140px]" />
        <div className="absolute top-40 left-[-8%] h-[420px] w-[420px] rounded-full bg-violet/[0.08] blur-[140px]" />

        {/* Ultra-fine grid — premium technical texture */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground) / 0.04) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 75%)",
          }}
        />

        {/* Bottom fade to seamless transition */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container relative pt-10 pb-14 sm:pt-20 sm:pb-24 md:pt-24">
        {/* ============== Hero content — centered, generous spacing ============== */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Status chip — refined, technical */}
          <Link
            to="/iraq"
            className="animate-fade-in-up group/chip inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 py-1.5 ps-1.5 pe-4 text-[11.5px] font-medium text-muted-foreground shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-soft hover:text-foreground hover:shadow-sm sm:text-[12px]"
            style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60 animate-ping-soft" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              مباشر
            </span>
            <span className="text-foreground/80">دليل الإلكترونيات في العراق</span>
            <ArrowLeft className="h-3 w-3 text-muted-foreground/70 transition-transform group-hover/chip:-translate-x-0.5" strokeWidth={2.4} />
          </Link>

          {/* Headline — Linear-style large, tight, refined */}
          <h1
            className="animate-fade-in-up font-display mt-7 text-balance text-[clamp(2.1rem,5vw,4rem)] font-bold leading-[1.04] tracking-[-0.035em] text-foreground sm:mt-8"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
          >
            كل محلات الإلكترونيات
            <br />
            <span className="relative inline-block bg-gradient-to-l from-violet via-primary to-cyan bg-clip-text text-transparent">
              بمكان واحد.
              <svg aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-1 h-2 w-full text-primary/30" viewBox="0 0 100 8" preserveAspectRatio="none" fill="none">
                <path d="M0 4 Q 25 0, 50 4 T 100 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subheading — calm, restrained */}
          <p
            className="animate-fade-in-up mx-auto mt-5 max-w-[34rem] text-pretty text-[14.5px] leading-[1.75] text-muted-foreground sm:mt-7 sm:text-[16px] sm:leading-[1.8]"
            style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
          >
            قارن الأسعار، شوف العنوان والتقييم، وتواصل مع المحل مباشرةً —
            من شارع الصناعة لحد البصرة وأربيل.
          </p>

          {/* Search — primary CTA */}
          <div
            className="animate-fade-in-up relative z-30 mx-auto mt-8 max-w-2xl sm:mt-11"
            style={{ animationDelay: "240ms", animationFillMode: "backwards" }}
          >
            <HeroSearch />
          </div>

          {/* Trust pills — single understated row */}
          <div
            className="animate-fade-in-up mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:mt-8 sm:gap-x-4"
            style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
          >
            {trustPills.map((pill, idx) => {
              const tones = toneClasses[pill.tone];
              const Icon = pill.icon;
              return (
                <span key={pill.label} className="inline-flex items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/90 sm:text-[12.5px]">
                    <Icon className={`h-3.5 w-3.5 ${tones.text}`} strokeWidth={2.4} />
                    <span>{pill.label}</span>
                  </span>
                  {idx < trustPills.length - 1 && (
                    <span aria-hidden className="text-muted-foreground/30">·</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* ============== Stat row — clean inline metrics, dividers, no cards ============== */}
        <div className="mx-auto mt-10 max-w-3xl sm:mt-16">
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border/70 overflow-hidden rounded-2xl border border-border/60 bg-card/40 sm:backdrop-blur-md">
            {statCards.map((stat, index) => {
              const tones = toneClasses[stat.tone];
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="animate-fade-in-up group flex flex-col items-center gap-2 px-2 py-5 text-center transition-colors duration-300 hover:bg-card/70 sm:gap-2.5 sm:py-6"
                  style={{ animationDelay: `${480 + index * 80}ms`, animationFillMode: "backwards" }}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones.bg} ${tones.text} ring-1 ${tones.ring} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-10 sm:w-10`}>
                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
                  </span>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-numeric tabular-nums text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl"
                  />
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium tracking-wide text-muted-foreground sm:text-[11.5px]">
                    <span aria-hidden className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Destination tiles */}
        <HeroDestinations />
      </div>
    </section>
  );
}

