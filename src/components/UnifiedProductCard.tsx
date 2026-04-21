import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  TrendingDown,
  Package,
  ShieldCheck,
  Award,
  ArrowLeft,
  Tag,
  CircleDot,
} from "lucide-react";
import { formatIQD, type UnifiedProduct } from "@/lib/unifiedSearch";
import { optimizeImageUrl } from "@/lib/imageUrl";
import { getFallbackProductImage, isRenderableProductImage } from "@/lib/productVisuals";
import { decodeHtmlEntities } from "@/lib/textDisplay";

interface Props {
  product: UnifiedProduct;
  /** Optional preview of top offers — shown as compact compare strip */
  topOffers?: { storeName: string; price: number; verified?: boolean; officialDealer?: boolean }[];
}

export const UnifiedProductCard = memo(function UnifiedProductCard({ product, topOffers }: Props) {
  const title = decodeHtmlEntities(product.title);
  const brand = decodeHtmlEntities(product.brand);
  const savings =
    product.highestPrice && product.lowestPrice && product.highestPrice > product.lowestPrice
      ? Math.round(((product.highestPrice - product.lowestPrice) / product.highestPrice) * 100)
      : 0;

  const priceSpread =
    product.highestPrice && product.lowestPrice ? product.highestPrice - product.lowestPrice : 0;

  const inStockRatio =
    product.offerCount > 0 ? Math.round((product.inStockCount / product.offerCount) * 100) : 0;
  const fallbackImage = getFallbackProductImage(product.category);
  const primaryImage =
    product.images.find((image) => isRenderableProductImage(image)) ?? fallbackImage;
  const displayImage = optimizeImageUrl(primaryImage, { width: 720, height: 576 }) ?? primaryImage;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform hover:-translate-y-1 hover:border-border hover:shadow-[0_12px_32px_-16px_hsl(220_40%_20%/0.12)]"
    >
      {/* ===== Image area ===== */}
      <div className="relative aspect-[5/4] overflow-hidden bg-muted/30">
        <div className="relative z-[1] flex h-full items-center justify-center">
          <img
            src={displayImage}
            alt={title}
            loading="lazy"
            decoding="async"
            width={720}
            height={576}
            onError={(event) => {
              if (event.currentTarget.src !== fallbackImage) {
                event.currentTarget.src = fallbackImage;
              }
            }}
            className="relative z-[2] h-full w-full object-contain object-center p-4 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.05]"
          />
        </div>

        {/* Top-left: discount badge */}
        {savings > 5 && (
          <div className="absolute start-3 top-3 flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background sm:text-[11px]">
            <TrendingDown className="h-2.5 w-2.5" />
            <span className="tabular-nums">-{savings}%</span>
          </div>
        )}

        {/* Top-right: offer count chip */}
        <div className="absolute end-3 top-3 flex items-center gap-1 rounded-full bg-card/85 px-2 py-0.5 text-[10px] font-semibold text-foreground/80 backdrop-blur-md sm:text-[11px]">
          <Store className="h-2.5 w-2.5" />
          <span className="tabular-nums">{product.offerCount}</span>
        </div>

        {/* Bottom-left: stock pill */}
        <div className="absolute bottom-3 start-3">
          {product.inStockCount > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full bg-card/85 px-2 py-0.5 text-[10px] font-semibold text-accent-emerald backdrop-blur-md sm:text-[11px]">
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-emerald" />
              <span className="tabular-nums">متوفر</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-card/85 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground backdrop-blur-md sm:text-[11px]">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              نفد
            </div>
          )}
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:gap-2.5 sm:p-5">
        {/* Brand + category — dot-separated */}
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
          {product.brand && (
            <span className="font-semibold tracking-wide text-foreground/75">{brand}</span>
          )}
          {product.brand && product.category && (
            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" aria-hidden />
          )}
          {product.category && <span className="truncate text-muted-foreground/80">{product.category}</span>}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[2.6em] text-balance text-[13px] font-medium leading-snug tracking-tight text-foreground sm:text-[14.5px]">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline justify-between gap-3 pt-0.5">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-muted-foreground/70">يبدأ من</span>
            <span className="font-outfit tabular-nums text-[18px] font-semibold leading-tight tracking-tight text-foreground sm:text-[20px]">
              {formatIQD(product.lowestPrice ?? 0)}
            </span>
          </div>
          {priceSpread > 0 && product.highestPrice && (
            <span className="tabular-nums text-[10px] text-muted-foreground/60 line-through sm:text-[11px]">
              {formatIQD(product.highestPrice)}
            </span>
          )}
        </div>

        {topOffers && topOffers.length > 0 && (
          <ul className="flex flex-col gap-1.5 rounded-xl bg-muted/30 px-2.5 py-2">
            {topOffers.slice(0, 3).map((o, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2 text-[12px]">
                <div className="flex min-w-0 items-center gap-1.5">
                  {o.officialDealer ? (
                    <Award className="h-3 w-3 shrink-0 text-primary" />
                  ) : o.verified ? (
                    <ShieldCheck className="h-3 w-3 shrink-0 text-accent-emerald" />
                  ) : (
                    <Store className="h-3 w-3 shrink-0 text-muted-foreground" />
                  )}
                  <span className="truncate font-medium text-foreground">{o.storeName}</span>
                </div>
                <span
                  className={
                    idx === 0
                      ? "shrink-0 font-bold text-accent-emerald"
                      : "shrink-0 font-semibold text-foreground"
                  }
                >
                  {formatIQD(o.price)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Meta — dot-separated */}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/40 pt-2.5 text-[10px] text-muted-foreground sm:text-[11px]">
          {inStockRatio > 0 && (
            <>
              <span className="flex items-center gap-1">
                <span className="tabular-nums font-semibold text-foreground/75">{inStockRatio}%</span>
                <span className="text-muted-foreground/80">توفر</span>
              </span>
              <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" aria-hidden />
            </>
          )}
          <span className="flex items-center gap-1">
            <span className="tabular-nums font-semibold text-foreground/75">{product.offerCount}</span>
            <span className="text-muted-foreground/80">عرض</span>
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" aria-hidden />
            <ShieldCheck className="h-3 w-3 text-accent-emerald" />
            <span className="text-muted-foreground/80">موثّق</span>
          </span>
        </div>
      </div>

    </Link>
  );
});