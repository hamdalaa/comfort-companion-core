/**
 * ShopResultCard — vertical, photo-led card optimized for the /search shop grid.
 * Designed to scale cleanly from 1-col mobile up to 4-col desktop.
 * Apple-style: minimal borders, soft shadow on hover, generous breathing room.
 */
import { memo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
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
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card animate-enter shadow-[0_0_0_1px_hsl(var(--foreground)/0.05),0_1px_2px_-1px_hsl(var(--foreground)/0.06),0_2px_4px_0_hsl(var(--foreground)/0.04)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_hsl(var(--foreground)/0.08),0_20px_40px_-20px_hsl(var(--foreground)/0.18),0_8px_16px_-12px_hsl(var(--foreground)/0.12)]"
      style={{ ["--stagger" as never]: Math.min(index, 12) }}
    >
      {/* ===== Image area ===== */}
      <Link
        to={`/shop-view/${shop.id}`}
        className="img-outline relative block aspect-[4/3] overflow-hidden bg-surface"
      >
        <img
          src={img}
          alt={shop.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
        />
        {/* Gradient overlay for badge legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Verified — top start */}
        {shop.verified && (
          <div className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2 py-1 text-[10px] font-semibold text-accent-emerald shadow-soft-sm backdrop-blur-md sm:text-[11px]">
            <ShieldCheck className="h-3 w-3" />
            <span>موثّق</span>
          </div>
        )}

        {/* Rating — top end */}
        {rating && (
          <div className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2 py-1 text-[10px] font-bold text-foreground shadow-soft-sm backdrop-blur-md sm:text-[11px]">
            <Star className="h-3 w-3 fill-amber text-amber" />
            <span className="tabular-nums">{rating.rating.toFixed(1)}</span>
            {rating.userRatingCount > 0 && (
              <span className="tabular-nums font-normal text-muted-foreground">
                ({rating.userRatingCount})
              </span>
            )}
          </div>
        )}
      </Link>

      {/* ===== Body ===== */}
      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
        {/* Categories — dot-separated, minimal */}
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
          {categories.slice(0, 3).map((c, i) => (
            <span key={c} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" aria-hidden />}
              <span className="truncate">{CAT_LABELS[c] ?? c}</span>
            </span>
          ))}
        </div>

        {/* Name */}
        <Link
          to={`/shop-view/${shop.id}`}
          className="block"
        >
          <h3 className="line-clamp-2 min-h-[2.6em] text-balance text-[14px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[15px]">
            {shop.name}
          </h3>
        </Link>

        {/* Address */}
        {location && (
          <div className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground sm:text-[12px]">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/70" />
            <span className="line-clamp-2">{location}</span>
          </div>
        )}

        {/* Contact actions — bottom, minimal pill row */}
        <div className="mt-auto flex items-center gap-1 pt-2">
          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              onClick={(e) => e.stopPropagation()}
              aria-label="اتصال"
              className="grid h-8 w-8 place-items-center rounded-full bg-surface/60 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5" />
            </a>
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              aria-label="واتساب"
              className="grid h-8 w-8 place-items-center rounded-full bg-surface/60 text-muted-foreground transition-colors hover:bg-accent-emerald/10 hover:text-accent-emerald"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          )}
          {shop.website && (
            <a
              href={shop.website}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              aria-label="موقع"
              className="grid h-8 w-8 place-items-center rounded-full bg-surface/60 text-muted-foreground transition-colors hover:bg-accent-cyan/10 hover:text-accent-cyan"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
          )}
          {shop.googleMapsUrl && (
            <a
              href={shop.googleMapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              aria-label="خرائط"
              className="grid h-8 w-8 place-items-center rounded-full bg-surface/60 text-muted-foreground transition-colors hover:bg-accent-violet/10 hover:text-accent-violet"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {/* CTA — Apple-style ghost text link, fills opacity on hover */}
          <Link
            to={`/shop-view/${shop.id}`}
            className="ms-auto inline-flex items-center gap-1 text-[12px] font-medium text-primary opacity-70 transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:opacity-100 sm:text-[13px]"
          >
            <span>فتح المحل</span>
            <ArrowLeft className="h-3.5 w-3.5 -translate-x-0.5 scale-90 opacity-0 blur-[2px] transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 group-hover:blur-0" />
          </Link>
        </div>
      </div>
    </article>
  );
});
