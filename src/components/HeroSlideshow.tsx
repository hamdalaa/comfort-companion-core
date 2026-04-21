import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import sinaaImg from "@/assets/street-sinaa.jpg";
import rubaieImg from "@/assets/street-rubaie.jpg";
import iraqImg from "@/assets/iraq-cities.jpg";

interface Slide {
  to: string;
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  img: string;
}

const SLIDES: Slide[] = [
  {
    to: "/iraq",
    kicker: "خرائط",
    title: "كل محلات العراق بمكان واحد",
    subtitle: "10 محافظات · 1,200+ محل ميداني موثوق",
    cta: "افتح الأطلس",
    img: iraqImg,
  },
  {
    to: "/results",
    kicker: "قارن الأسعار",
    title: "آيفون 15 من 40+ محل بنفس اللحظة",
    subtitle: "شوف أرخص سعر، أعلى تقييم، وأقرب محل قبل ما تتحرك.",
    cta: "شوف العروض",
    img: rubaieImg,
  },
  {
    to: "/sinaa",
    kicker: "بغداد",
    title: "شارع الصناعة على خارطة واحدة",
    subtitle: "حاسبات، شبكات، طابعات — كل المحلات بصف وحد.",
    cta: "روح للشارع",
    img: sinaaImg,
  },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <div className="relative mx-auto mt-8 w-full max-w-5xl sm:mt-12">
      <Link
        to={slide.to}
        className="group block overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft-lg transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-soft-xl"
        aria-label={slide.title}
      >
        <div className="grid items-stretch gap-0 sm:grid-cols-[1fr_1.1fr]">
          {/* Content */}
          <div className="order-2 flex flex-col justify-center px-6 py-8 text-right sm:order-1 sm:px-10 sm:py-12 md:px-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground self-end">
              {slide.kicker}
            </span>

            <h3
              key={`title-${active}`}
              className="font-display mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground animate-fade-in-up sm:mt-5 sm:text-3xl md:text-4xl"
            >
              {slide.title}
            </h3>

            <p
              key={`sub-${active}`}
              className="mt-3 text-pretty text-sm leading-7 text-muted-foreground animate-fade-in-up sm:mt-4 sm:text-base sm:leading-8"
              style={{ animationDelay: "60ms", animationFillMode: "backwards" }}
            >
              {slide.subtitle}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 sm:mt-8">
              <span className="link-underline inline-flex items-center text-sm font-semibold text-primary">
                {slide.cta}
              </span>
              <ArrowLeft className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 aspect-[16/10] overflow-hidden bg-muted sm:order-2 sm:aspect-auto">
            {SLIDES.map((s, i) => (
              <img
                key={s.to}
                src={s.img}
                alt={s.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div aria-hidden className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-card to-transparent sm:block" />
          </div>
        </div>
      </Link>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.to}
            type="button"
            aria-label={`عرض الشريحة ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}