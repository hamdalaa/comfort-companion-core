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
        {/* Premium spotlight wash — multi-radial, theme-aware */}
        <div className="absolute inset-0 bg-gradient-spotlight" />

        {/* Color halos — ambient corner lights */}
        <div className="halo-primary -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2" />
        <div className="halo-cyan top-24 right-[-10%] h-[420px] w-[420px]" />
        <div className="halo-violet top-32 left-[-10%] h-[420px] w-[420px]" />
        <div className="halo-amber bottom-[-10%] right-[20%] h-[360px] w-[360px]" />

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
        {/* Storefront — top left */}
        <svg
          className="absolute top-8 left-[5%] h-12 w-12 animate-drift-1 text-primary/35 sm:h-16 sm:w-16"
          style={{ animationDelay: "0.2s" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9 L5 4 H19 L21 9" />
          <path d="M4 9 V20 H20 V9" />
          <path d="M9 20 V13 H15 V20" />
          <path d="M3 9 H21" />
        </svg>

        {/* Shopping bag — top right */}
        <svg
          className="absolute top-12 right-[7%] h-11 w-11 animate-drift-2 text-cyan/45 sm:h-14 sm:w-14"
          style={{ animationDelay: "0.6s" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8 H19 L18 21 H6 Z" />
          <path d="M9 8 V6 a3 3 0 0 1 6 0 V8" />
        </svg>

        {/* Price tag — mid right */}
        <svg
          className="absolute top-[38%] right-[4%] h-9 w-9 animate-drift-3 text-violet/45 sm:h-12 sm:w-12"
          style={{ animationDelay: "1.2s" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3 H12 L21 12 L12 21 L3 12 Z" />
          <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" />
        </svg>

        {/* Coin (currency) — mid left */}
        <svg
          className="absolute top-[32%] left-[4%] h-10 w-10 animate-drift-2 text-warning/60 sm:h-12 sm:w-12"
          style={{ animationDelay: "0.8s" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="6" opacity="0.5" />
          <text x="12" y="15.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">$</text>
        </svg>

        {/* Mini receipt — bottom left */}
        <svg
          className="absolute bottom-[20%] left-[8%] h-10 w-10 animate-drift-1 text-emerald/50 sm:h-12 sm:w-12"
          style={{ animationDelay: "1.4s" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3 H18 V21 L15 19 L12 21 L9 19 L6 21 Z" />
          <path d="M9 8 H15" />
          <path d="M9 12 H15" />
          <path d="M9 16 H13" />
        </svg>

        {/* Coin stack — bottom right */}
        <svg
          className="absolute bottom-[16%] right-[7%] h-12 w-12 animate-drift-3 text-rose/45 sm:h-14 sm:w-14"
          style={{ animationDelay: "1.6s" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="6" rx="7" ry="2.2" />
          <path d="M5 6 V10 a7 2.2 0 0 0 14 0 V6" />
          <path d="M5 11 V15 a7 2.2 0 0 0 14 0 V11" opacity="0.7" />
          <path d="M5 16 V19 a7 2.2 0 0 0 14 0 V16" opacity="0.5" />
        </svg>

        {/* Small percent badge — top center */}
        <div
          className="absolute top-[8%] right-[40%] hidden h-9 w-9 items-center justify-center rounded-full border border-emerald/30 bg-emerald-soft/60 text-[11px] font-bold text-emerald shadow-[0_6px_18px_-6px_hsl(var(--accent-emerald)/0.4)] animate-drift-2 sm:flex"
          style={{ animationDelay: "0.4s" }}
        >
          %
        </div>

        {/* Sparkle coins cluster — bottom mid */}
        <div className="absolute bottom-[26%] left-[44%] hidden items-end gap-1.5 sm:flex">
          <span className="block h-2 w-2 rounded-full bg-warning/70 animate-ping-soft ring-2 ring-warning/20" />
          <span className="block h-1.5 w-1.5 rounded-full bg-primary/60" />
        </div>
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
            <span className="relative inline-block text-grad-iridescent">
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

