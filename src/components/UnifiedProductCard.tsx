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
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-20px_hsl(220_40%_20%/0.15),0_8px_16px_-12px_hsl(220_40%_20%/0.1)]"
    >
      {/* ===== Image area ===== */}
      <div className="relative aspect-[5/4] overflow-hidden bg-card">
        <div className="relative z-[1] flex h-full items-center justify-center px-4 pb-4 pt-10 sm:px-5 sm:pb-5 sm:pt-11">
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
            className="relative z-[2] max-h-[90%] w-auto max-w-[92%] object-contain object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04] sm:max-h-[92%] sm:max-w-[94%]"
          />
        </div>

        {/* Top-left: discount badge */}
        {savings > 5 && (
          <div className="absolute start-2.5 top-2.5 flex items-center gap-1 rounded-full bg-accent-rose/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-[0_4px_12px_-2px_hsl(var(--accent-rose)/0.5)] backdrop-blur-sm sm:start-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span className="tabular-nums">-{savings}%</span>
          </div>
        )}

        {/* Top-right: offer count chip */}
        <div className="absolute end-2.5 top-2.5 flex items-center gap-1 rounded-full border border-border/50 bg-card/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-soft-sm backdrop-blur-md sm:end-3 sm:top-3 sm:px-2 sm:py-1 sm:text-[11px]">
          <Store className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
          <span className="tabular-nums">{product.offerCount}</span>
        </div>

        {/* Bottom-left: stock pill */}
        <div className="absolute bottom-2.5 start-2.5 sm:bottom-3 sm:start-3">
          {product.inStockCount > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-accent-emerald/20 bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-accent-emerald shadow-soft-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[11px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-emerald" />
              </span>
              <span className="tabular-nums sm:hidden">{product.inStockCount} متوفر</span>
              <span className="hidden tabular-nums sm:inline">متوفر بـ {product.inStockCount} محل</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-destructive/20 bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-destructive shadow-soft-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[11px]">
              <CircleDot className="h-2.5 w-2.5 fill-destructive text-destructive sm:h-3 sm:w-3" />
              نفد
            </div>
          )}
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
        {/* Brand + category — dot-separated */}
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
          {product.brand && (
            <span className="font-bold uppercase tracking-wider text-foreground/70">{brand}</span>
          )}
          {product.brand && product.category && (
            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" aria-hidden />
          )}
          {product.category && <span className="truncate">{product.category}</span>}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[2.6em] text-balance text-[13px] font-semibold leading-snug text-foreground sm:text-[15px]">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80 sm:text-[10px]">
              يبدأ من
            </span>
            <span className="font-outfit tabular-nums text-lg font-extrabold leading-none text-foreground sm:text-xl">
              {formatIQD(product.lowestPrice ?? 0)}
            </span>
          </div>
          {priceSpread > 0 && product.highestPrice && (
            <span className="tabular-nums text-[9px] text-muted-foreground/70 line-through sm:text-[10px]">
              {formatIQD(product.highestPrice)}
            </span>
          )}
        </div>

        {topOffers && topOffers.length > 0 && (
          <ul className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-surface/40 px-2.5 py-2">
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
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[10px] text-muted-foreground sm:text-[11px]">
          {inStockRatio > 0 && (
            <>
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3 text-accent-emerald" />
                <span className="tabular-nums font-semibold text-foreground/80">{inStockRatio}%</span>
                <span>توفر</span>
              </span>
              <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" aria-hidden />
            </>
          )}
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-primary" />
            <span className="tabular-nums font-semibold text-foreground/80">{product.offerCount}</span>
            <span>عرض</span>
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" aria-hidden />
            <ShieldCheck className="h-3 w-3 text-accent-emerald" />
            <span>موثّق</span>
          </span>
        </div>
      </div>

      {/* ===== CTA — refined ghost-elevated, fills with primary on hover ===== */}
      <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-primary opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:opacity-100 sm:text-[13px]">
          <span>عرض التفاصيل</span>
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
});