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
    <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-5">
      {DESTINATIONS.map((d) => (
        <Link
          key={d.to}
          to={d.to}
          className="group relative block overflow-hidden rounded-[1.25rem] border border-border/60 bg-card/85 shadow-xs backdrop-blur-md transition-[transform,box-shadow,border-color] duration-500 ease-ios hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
          aria-label={d.title}
        >
          <div className="relative aspect-[5/3] overflow-hidden bg-muted">
            <img
              src={d.img}
              alt={d.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground shadow-xs backdrop-blur-md">
              {d.kicker}
            </span>
            {/* Title overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
              <h3 className="font-display truncate text-base font-semibold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-[17px]">
                {d.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3.5 text-right sm:px-5 sm:py-4">
            <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary transition-transform duration-300 group-hover:-translate-x-1">
              استكشف <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <p className="min-w-0 flex-1 truncate text-[11.5px] text-muted-foreground sm:text-[12.5px]">
              {d.meta}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}