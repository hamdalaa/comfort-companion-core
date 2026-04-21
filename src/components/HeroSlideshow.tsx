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

  return (
    <div className="relative mx-auto mt-8 w-full max-w-5xl sm:mt-12">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft-xl sm:aspect-[21/9]">
        {SLIDES.map((slide, i) => (
          <Link
            key={slide.to}
            to={slide.to}
            aria-hidden={i !== active}
            tabIndex={i !== active ? -1 : 0}
            className={`group absolute inset-0 transition-opacity duration-700 ease-out ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                i === active ? "scale-105" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-foreground/85 via-foreground/40 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="container">
                <div className="max-w-md text-right text-white sm:max-w-lg md:max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md">
                    {slide.kicker}
                  </span>
                  <h3 className="font-display mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:mt-4 sm:text-4xl md:text-5xl">
                    {slide.title}
                  </h3>
                  <p className="mt-2 text-pretty text-xs leading-6 text-white/90 sm:mt-3 sm:text-sm sm:leading-7 md:text-base">
                    {slide.subtitle}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft-lg transition-transform duration-300 group-hover:scale-105 sm:mt-5 sm:px-5 sm:py-2.5 sm:text-sm">
                    <span>{slide.cta}</span>
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-3 flex items-center justify-center gap-2 sm:mt-4">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.to}
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