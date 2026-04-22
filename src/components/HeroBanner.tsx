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

      {/* ============== Creative floating shapes ============== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
        {/* Rotating dashed ring — top left */}
        <svg
          className="absolute -top-10 left-[6%] h-28 w-28 animate-spin-slow text-primary/25 sm:h-36 sm:w-36"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.6" />
        </svg>

        {/* Floating rounded square — top right */}
        <div
          className="absolute top-16 right-[8%] h-10 w-10 rotate-12 rounded-xl border border-cyan/30 bg-cyan-soft/40 shadow-[0_8px_24px_-8px_hsl(var(--accent-cyan)/0.35)] animate-float sm:h-14 sm:w-14"
          style={{ animationDelay: "0.4s" }}
        />

        {/* Triangle — mid right */}
        <svg
          className="absolute top-[36%] right-[4%] h-8 w-8 animate-float text-violet/40 sm:h-12 sm:w-12"
          style={{ animationDelay: "1.2s" }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3 L22 20 L2 20 Z" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" />
        </svg>

        {/* Plus sign — mid left */}
        <svg
          className="absolute top-[30%] left-[5%] h-6 w-6 animate-bounce-subtle text-emerald/50 sm:h-8 sm:w-8"
          style={{ animationDelay: "0.8s" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>

        {/* Sparkle dot cluster — bottom left */}
        <div className="absolute bottom-[22%] left-[10%] flex items-end gap-1.5">
          <span className="block h-1.5 w-1.5 rounded-full bg-primary/60 animate-ping-soft" />
          <span className="block h-1 w-1 rounded-full bg-violet/60" />
          <span className="block h-2 w-2 rounded-full bg-cyan/50 animate-float" style={{ animationDelay: "0.6s" }} />
        </div>

        {/* Concentric circle — bottom right */}
        <svg
          className="absolute bottom-[14%] right-[6%] h-20 w-20 animate-float text-rose/30 sm:h-28 sm:w-28"
          style={{ animationDelay: "1.6s" }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="50" cy="50" r="46" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="32" strokeWidth="0.8" opacity="0.7" />
          <circle cx="50" cy="50" r="18" strokeWidth="0.8" opacity="0.5" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>

        {/* Diagonal line — decorative accent */}
        <svg
          className="absolute top-[12%] left-[42%] hidden h-16 w-16 text-primary/20 sm:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          <path d="M10 90 L90 10" strokeWidth="1.5" strokeDasharray="2 4" />
        </svg>

        {/* Tiny star — top center */}
        <svg
          className="absolute top-[6%] right-[38%] h-5 w-5 animate-spin-slow text-amber-400/60 sm:h-6 sm:w-6"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.27 5.79 22l2.39-8.15L2 9.36h7.61z" />
        </svg>
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
            className="animate-fade-in-up mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-8 sm:gap-x-5"
            style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
          >
            {trustPills.map((pill) => {
              const tones = toneClasses[pill.tone];
              const Icon = pill.icon;
              return (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/90 sm:text-[12.5px]"
                >
                  <Icon className={`h-3.5 w-3.5 ${tones.text}`} strokeWidth={2.4} />
                  <span>{pill.label}</span>
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
                  className="animate-fade-in-up group flex min-w-0 flex-col items-center gap-1.5 px-1.5 py-4 text-center transition-colors duration-300 hover:bg-card/70 sm:gap-2.5 sm:px-2 sm:py-6"
                  style={{ animationDelay: `${480 + index * 80}ms`, animationFillMode: "backwards" }}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${tones.bg} ${tones.text} ring-1 ${tones.ring} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-10 sm:w-10`}>
                    <Icon className="h-[14px] w-[14px] sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
                  </span>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-numeric block max-w-full truncate tabular-nums text-base font-bold leading-none tracking-tight text-foreground sm:text-2xl"
                  />
                  <span className="inline-flex max-w-full items-center gap-1.5 truncate text-[10px] font-medium tracking-wide text-muted-foreground sm:text-[11.5px]">
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

