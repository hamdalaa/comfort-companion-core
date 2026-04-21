/**
 * StickyBuyBar — appears on the ProductDetail page after the user scrolls
 * past the hero. Shows thumbnail + title + lowest price + primary CTA
 * (open best offer) + secondary CTA (compare offers in-page anchor).
 * Hidden on mobile to avoid colliding with BottomTabBar.
 */
import { useEffect, useState } from "react";
import { ExternalLink, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIQD, type UnifiedOffer, type UnifiedProduct } from "@/lib/unifiedSearch";
import { optimizeImageUrl } from "@/lib/imageUrl";
import { getFallbackProductImage, isRenderableProductImage } from "@/lib/productVisuals";
import { decodeHtmlEntities } from "@/lib/textDisplay";
import { cn } from "@/lib/utils";

interface Props {
  product: UnifiedProduct;
  bestOffer?: UnifiedOffer;
  /** Anchor id of the offers list — used by the "compare" CTA. */
  offersAnchorId?: string;
}

export function StickyBuyBar({ product, bestOffer, offersAnchorId = "all-offers" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Show after scrolling past 600px (approx. past the hero)
        setVisible(window.scrollY > 600);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fallback = getFallbackProductImage(product.category);
  const primary =
    product.images.find((img) => isRenderableProductImage(img)) ?? fallback;
  const thumb = optimizeImageUrl(primary, { width: 80, height: 80 }) ?? primary;
  const title = decodeHtmlEntities(product.title);

  return (
    <div
      role="region"
      aria-label="شريط الشراء السريع"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 hidden border-t border-border/60 bg-background/95 shadow-soft-xl backdrop-blur-2xl transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:block",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="container flex items-center gap-3 py-3">
        <img
          src={thumb}
          alt=""
          className="h-12 w-12 shrink-0 rounded-xl border border-border/60 object-cover"
          onError={(e) => {
            if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="line-clamp-1 text-[13px] font-semibold leading-tight text-foreground">
            {title}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-muted-foreground/80">يبدأ من</span>
            <span className="font-outfit text-[15px] font-semibold tabular-nums text-foreground">
              {product.lowestPrice ? formatIQD(product.lowestPrice) : "—"}
            </span>
            {bestOffer && (
              <span className="hidden text-[11px] text-muted-foreground lg:inline">
                · {decodeHtmlEntities(bestOffer.storeName)}
              </span>
            )}
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full">
          <a href={`#${offersAnchorId}`}>
            <Scale className="me-1 h-3.5 w-3.5" />
            قارن
          </a>
        </Button>
        {bestOffer ? (
          <Button asChild variant="primary" size="sm" className="shrink-0 rounded-full">
            <a href={bestOffer.productUrl} target="_blank" rel="noopener noreferrer">
              اطلب من {decodeHtmlEntities(bestOffer.storeName)}
              <ExternalLink className="ms-1 h-3.5 w-3.5" />
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}