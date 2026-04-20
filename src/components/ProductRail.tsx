import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductRailSkeleton } from "./ProductRailSkeleton";
import { useFakeLoading } from "@/hooks/useFakeLoading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { ScoredProduct } from "@/lib/search";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  seeAllTo?: string;
  products: ScoredProduct[];
}

export function ProductRail({ title, seeAllTo, products }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const loading = useFakeLoading(600);
  const { ref: revealRef, revealed } = useScrollReveal<HTMLElement>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  // Track scroll position → derive page count + active dot
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      const total = el.scrollWidth;
      const view = el.clientWidth;
      const pages = Math.max(1, Math.ceil(total / Math.max(view, 1)));
      setPageCount(pages);
      const idx = Math.round(el.scrollLeft / Math.max(view, 1));
      setPageIndex(Math.min(pages - 1, Math.max(0, idx)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [products.length]);

  if (loading) return <ProductRailSkeleton />;
  if (products.length === 0) return null;

  const scroll = (direction: 1 | -1) => {
    const element = railRef.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section
      ref={revealRef}
      className={cn("atlas-panel py-4 sm:py-5 reveal-init", revealed && "reveal-on")}
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6">
        <div className="text-right min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">رف مختار</div>
          <h2 className="font-display mt-1 text-xl font-bold leading-tight text-foreground sm:mt-2 sm:text-2xl md:text-3xl">{title}</h2>
        </div>
        {seeAllTo && (
          <Link
            to={seeAllTo}
            className="group/all inline-flex shrink-0 items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold text-foreground transition-[background-color,border-color,color] hover:border-border/60 hover:bg-surface sm:text-sm"
          >
            شوف الكل
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/all:-translate-x-1" />
          </Link>
        )}
      </div>

      <div className="relative mt-4 sm:mt-5 group/rail">
        <div
          ref={railRef}
          className="flex gap-3 overflow-x-auto px-4 pb-2 pt-1 snap-x snap-mandatory scroll-smooth sm:gap-4 sm:px-6"
          style={{ scrollbarWidth: "none", scrollPaddingInline: "1.5rem" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 shrink-0 snap-start basis-[78%] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)] xl:basis-[calc((100%-3rem)/4)] 2xl:basis-[calc((100%-4rem)/5)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          aria-label="السابق"
          className="ios-tap hidden md:flex absolute left-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/95 shadow-soft-lg backdrop-blur-md transition-[opacity,transform,background-color,border-color] hover:border-primary/50 hover:bg-card hover:text-primary opacity-0 group-hover/rail:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll(-1)}
          aria-label="التالي"
          className="ios-tap hidden md:flex absolute right-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/95 shadow-soft-lg backdrop-blur-md transition-[opacity,transform,background-color,border-color] hover:border-primary/50 hover:bg-card hover:text-primary opacity-0 group-hover/rail:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {pageCount > 1 && (
        <div className="mt-3 flex justify-center px-4 sm:mt-4">
          <div className="rail-dots" role="tablist" aria-label="صفحات الرف">
            {Array.from({ length: pageCount }).map((_, i) => (
              <span
                key={i}
                className="rail-dot"
                data-active={i === pageIndex ? "true" : "false"}
                aria-current={i === pageIndex ? "page" : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
