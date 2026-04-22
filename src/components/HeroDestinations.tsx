import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import sinaaImg from "@/assets/street-sinaa.jpg";
import rubaieImg from "@/assets/street-rubaie.jpg";
import iraqImg from "@/assets/iraq-cities.jpg";

interface Destination {
  to: string;
  kicker: string;
  title: string;
  meta: string;
  img: string;
  badge?: string;
}

const DESTINATIONS: Destination[] = [
  {
    to: "/iraq",
    kicker: "خرائط",
    title: "كل محافظات العراق",
    meta: "10 محافظات · 1,200+ محل",
    img: iraqImg,
    badge: "جديد",
  },
  {
    to: "/sinaa",
    kicker: "بغداد",
    title: "شارع الصناعة",
    meta: "حاسبات · شبكات · طابعات",
    img: sinaaImg,
  },
  {
    to: "/rubaie",
    kicker: "بغداد",
    title: "شارع الربيعي",
    meta: "موبايلات · إكسسوارات",
    img: rubaieImg,
  },
];

export function HeroDestinations() {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  return (
    <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-5">
      {DESTINATIONS.map((d, index) => (
        <Link
          key={d.to}
          to={d.to}
          className="group animate-fade-in-up relative block overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 ease-ios will-change-transform [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-foreground/20 [@media(hover:hover)]:hover:shadow-[0_12px_36px_-14px_hsl(var(--foreground)/0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={d.title}
          style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: "backwards" }}
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            {!loaded[d.to] && (
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
            )}
            <img
              src={d.img}
              alt={d.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded((prev) => ({ ...prev, [d.to]: true }))}
              className={`h-full w-full object-cover transition-[transform,opacity] duration-[900ms] ease-out [@media(hover:hover)]:group-hover:scale-[1.06] ${loaded[d.to] ? "opacity-100" : "opacity-0"}`}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
            <div className="absolute end-3 top-3 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground shadow-xs backdrop-blur-md">
                {d.kicker}
              </span>
              {d.badge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2 py-1 text-[10px] font-bold text-emerald shadow-xs">
                  <Sparkles className="h-2.5 w-2.5" strokeWidth={2.6} />
                  {d.badge}
                </span>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <h3 className="font-display truncate text-base font-semibold tracking-tight text-background drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-[17px]">
                {d.title}
              </h3>
              <p className="mt-1 truncate text-[11.5px] text-background/80 sm:text-[12px]">
                {d.meta}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3.5 text-start sm:px-5">
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-foreground transition-transform duration-300 rtl:[@media(hover:hover)]:group-hover:translate-x-1 ltr:[@media(hover:hover)]:group-hover:-translate-x-1">
              استكشف <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70 tabular-nums">
              <span aria-hidden className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}