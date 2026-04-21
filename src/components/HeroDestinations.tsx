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
    <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
      {DESTINATIONS.map((d) => (
        <Link
          key={d.to}
          to={d.to}
          className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg"
          aria-label={d.title}
        >
          <div className="relative aspect-[5/3] overflow-hidden bg-muted">
            <img
              src={d.img}
              alt={d.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur-md">
              {d.kicker}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-4 text-right sm:px-5">
            <ArrowLeft className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display truncate text-base font-semibold text-foreground sm:text-lg">
                {d.title}
              </h3>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                {d.meta}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}