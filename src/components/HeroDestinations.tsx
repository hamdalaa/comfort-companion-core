import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import sinaaImg from "@/assets/street-sinaa.jpg";
import rubaieImg from "@/assets/street-rubaie.jpg";
import iraqImg from "@/assets/iraq-cities.jpg";

interface Destination {
  to: string;
  kicker: string;
  title: string;
  meta: string;
  img: string;
}

const DESTINATIONS: Destination[] = [
  {
    to: "/iraq",
    kicker: "خرائط",
    title: "كل محافظات العراق",
    meta: "10 محافظات · 1,200+ محل",
    img: iraqImg,
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
  return (
    <div className="mx-auto mt-16 grid w-full max-w-5xl grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-5">
      {DESTINATIONS.map((d, index) => (
        <Link
          key={d.to}
          to={d.to}
          className="group animate-fade-in-up relative block overflow-hidden rounded-2xl border border-border/60 bg-card transition-[transform,box-shadow,border-color] duration-500 ease-ios hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_16px_40px_-16px_hsl(var(--foreground)/0.18)]"
          aria-label={d.title}
          style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: "backwards" }}
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={d.img}
              alt={d.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/15 to-transparent" />
            <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground shadow-xs backdrop-blur-md">
              {d.kicker}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <h3 className="font-display truncate text-base font-semibold tracking-tight text-background drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-[17px]">
                {d.title}
              </h3>
              <p className="mt-1 truncate text-[11.5px] text-background/80 sm:text-[12px]">
                {d.meta}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3.5 text-right sm:px-5">
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-foreground transition-transform duration-300 group-hover:-translate-x-1">
              استكشف <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}