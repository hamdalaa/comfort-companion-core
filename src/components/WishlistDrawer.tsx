/**
 * WishlistDrawer — side sheet listing every favourited product as a full
 * card (image, brand, lowest price, link, remove button). Uses real
 * `UnifiedProduct` data fetched on demand via `getProduct()` so prices stay
 * fresh, with a graceful fallback to the local catalog index for shape.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Heart, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUserPrefs } from "@/lib/userPrefs";
import { useDataStore } from "@/lib/dataStore";
import { optimizeImageUrl } from "@/lib/imageUrl";
import { getFallbackProductImage, isRenderableProductImage } from "@/lib/productVisuals";
import { decodeHtmlEntities } from "@/lib/textDisplay";
import { formatIQD } from "@/lib/unifiedSearch";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WishlistDrawer({ open, onOpenChange }: Props) {
  const { favorites, toggleFavorite } = useUserPrefs();
  const { products } = useDataStore();

  // Resolve product cards from the local catalog index.
  const items = useMemo(
    () => products.filter((p) => favorites.has(p.id)),
    [products, favorites],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full overflow-y-auto border-r border-border/60 bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="sticky top-0 z-10 border-b border-border/60 bg-background/95 px-5 pb-4 pt-5 backdrop-blur-xl">
          <SheetTitle className="flex items-center justify-between gap-3 text-right">
            <span className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose/15 text-rose">
                <Heart className="h-4.5 w-4.5 fill-current" />
              </span>
              <span className="font-display text-base font-semibold tracking-tight">
                المفضلة
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold tabular-nums text-muted-foreground">
                {items.length}
              </span>
            </span>
          </SheetTitle>
          <SheetDescription className="text-right text-[12px] text-muted-foreground">
            عناصرك المحفوظة محلياً بهذا المتصفح — تظل موجودة حتى لو سكّرت الصفحة.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <ul className="space-y-3 px-5 py-5">
            {items.map((p) => {
              const fallback = getFallbackProductImage(p.category);
              const raw = isRenderableProductImage(p.imageUrl) ? p.imageUrl : fallback;
              const img = optimizeImageUrl(raw, { width: 160, height: 160 }) ?? raw;
              const productHref = p.canonicalProductId
                ? `/product/${p.canonicalProductId}`
                : `/shop-view/${p.shopId}`;
              const title = decodeHtmlEntities(p.name);
              const brand = decodeHtmlEntities(p.brand);
              return (
                <li
                  key={p.id}
                  className="group flex items-stretch gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-soft transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-border hover:shadow-soft-md"
                >
                  <Link
                    to={productHref}
                    onClick={() => onOpenChange(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/40"
                    aria-label={title}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.05]"
                      onError={(e) => {
                        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                      }}
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to={productHref}
                      onClick={() => onOpenChange(false)}
                      className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors hover:text-primary"
                    >
                      {title}
                    </Link>
                    {brand && (
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {brand}
                      </div>
                    )}
                    <div className="mt-auto flex items-baseline justify-between gap-2 pt-1.5">
                      <span className="font-outfit text-[14px] font-semibold tabular-nums text-foreground">
                        {p.priceValue ? formatIQD(p.priceValue) : "—"}
                      </span>
                      <Link
                        to={productHref}
                        onClick={() => onOpenChange(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        افتح
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(p.id)}
                    aria-label="إزالة من المفضلة"
                    className="ios-tap inline-flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmptyWishlist() {
  return (
    <div className="px-5 py-12">
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose/10 text-rose">
          <Heart className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm font-medium leading-7 text-foreground">
          ما عندك عناصر محفوظة بعد
        </p>
        <p className="mt-1 text-[12px] leading-6 text-muted-foreground">
          اضغط القلب على أي منتج لتحفظه هنا للرجوع له لاحقاً.
        </p>
        <Button asChild className="mt-5 rounded-full" size="sm">
          <Link to="/search">تصفّح المنتجات</Link>
        </Button>
      </div>
    </div>
  );
}