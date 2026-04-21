/**
 * ShopResultCard — vertical, photo-led card optimized for the /search shop grid.
 * Designed to scale cleanly from 1-col mobile up to 4-col desktop.
 * Apple-style: minimal borders, soft shadow on hover, generous breathing room.
 */
import { memo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { CATEGORY_IMAGES } from "@/lib/categoryImages";
import { optimizeImageUrl } from "@/lib/imageUrl";
import type { Category, Shop } from "@/lib/types";

const CAT_LABELS: Partial<Record<Category, string>> = {
  Computing: "حاسبات",
  "PC Parts": "قطع PC",
  Networking: "شبكات",
  Gaming: "ألعاب",
  Cameras: "كاميرات",
  Printers: "طابعات",
  Phones: "هواتف",
  Chargers: "شواحن",
  Accessories: "إكسسوارات",
  Tablets: "تابلت",
  "Smart Devices": "أجهزة ذكية",
};

export const ShopResultCard = memo(function ShopResultCard({
  shop,
  previewImageUrl,
  index = 0,
}: {
  shop: Shop;
  previewImageUrl?: string;
  index?: number;
}) {
  const categories = shop.categories?.length ? shop.categories : [shop.category];
  const fallback = CATEGORY_IMAGES[categories[0]];
  const rawImg = previewImageUrl ?? shop.gallery?.[0] ?? shop.imageUrl ?? fallback;
  const img = optimizeImageUrl(rawImg, { width: 640, height: 480 }) ?? rawImg;
  const rating = typeof shop.rating === "number" && shop.rating > 0
    ? { rating: shop.rating, userRatingCount: shop.reviewCount ?? 0 }
    : null;
  const location = shop.address ?? shop.area;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card animate-enter shadow-[0_0_0_1px_hsl(var(--foreground)/0.04),0_1px_2px_0_hsl(var(--foreground)/0.04)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform hover:-translate-y-1 hover:shadow-[0_0_0_1px_hsl(var(--foreground)/0.06),0_16px_32px_-16px_hsl(var(--foreground)/0.14),0_4px_12px_-8px_hsl(var(--foreground)/0.08)]"
      style={{ ["--stagger" as never]: Math.min(index, 12) }}
    >
      {/* ===== Image area ===== */}
      <Link
        to={`/shop-view/${shop.id}`}
        className="relative block aspect-[5/4] overflow-hidden bg-surface"
      >
        <img
          src={img}
          alt={shop.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.05]"
        />
        {/* Subtle bottom gradient for depth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/15 to-transparent" />

        {/* Verified — top start, minimal pill */}
        {shop.verified && (
          <div className="absolute start-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-medium text-accent-emerald backdrop-blur-md">
            <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
            <span>موثّق</span>
          </div>
        )}
      </Link>

      {/* ===== Body ===== */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        {/* Top row: rating + primary category */}
        <div className="flex items-center justify-between gap-2">
          {rating ? (
            <div className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground">
              <Star className="h-3 w-3 fill-amber text-amber" strokeWidth={0} />
              <span className="tabular-nums">{rating.rating.toFixed(1)}</span>
              {rating.userRatingCount > 0 && (
                <span className="tabular-nums text-muted-foreground/70">
                  · {rating.userRatingCount}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground/60">جديد</span>
          )}
          <span className="truncate text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground/70">
            {CAT_LABELS[categories[0]] ?? categories[0]}
          </span>
        </div>

        {/* Name */}
        <Link to={`/shop-view/${shop.id}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.6em] text-balance text-[15px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {shop.name}
          </h3>
        </Link>

        {/* Address */}
        {location && (
          <div className="flex items-start gap-1.5 text-[12px] leading-relaxed text-muted-foreground">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60" strokeWidth={2} />
            <span className="line-clamp-2">{location}</span>
          </div>
        )}

        {/* Hairline separator */}
        <div className="mt-auto h-px w-full bg-border/60" />

        {/* Bottom row: contact icons + CTA */}
        <div className="flex items-center gap-0.5 pt-1">
          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              onClick={(e) => e.stopPropagation()}
              aria-label="اتصال"
              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground/70 transition-colors hover:bg-surface hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              aria-label="واتساب"
              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground/70 transition-colors hover:bg-surface hover:text-accent-emerald"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          )}
          {shop.website && (
            <a
              href={shop.website}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              aria-label="موقع"
              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground/70 transition-colors hover:bg-surface hover:text-accent-cyan"
            >
              <Globe className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          )}

          <Link
            to={`/shop-view/${shop.id}`}
            className="ms-auto inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <span>فتح المحل</span>
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
});
