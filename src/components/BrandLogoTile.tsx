import { Link } from "react-router-dom";
import { ShieldCheck, Store } from "lucide-react";
import type { BrandDealer } from "@/lib/types";
import { useBrandLogo } from "@/hooks/useBrandLogo";
import { cn } from "@/lib/utils";

interface Props {
  brand: BrandDealer;
  /** Optional badge in top corner — usually branch count */
  branchCount?: number;
  /** Use higher loading priority for above-the-fold tiles */
  eager?: boolean;
}

/**
 * Clean logo-first brand tile. Renders the official theSVG brand logo on a
 * neutral surface with a soft hover lift. Designed for dense grids where the
 * brand mark itself is the hero — not a background image.
 */
export function BrandLogoTile({ brand, branchCount = 0, eager = false }: Props) {
  const logo = useBrandLogo(brand.slug, brand.brandName, "default");
  const isVerified = brand.verificationStatus === "verified";
  // Apple's default theSVG logo ships in pure black on transparent — keep it
  // as-is now that the tile background is transparent.

  return (
    <Link
      to={`/brand/${brand.slug}`}
      aria-label={brand.brandName}
      className="group relative flex aspect-square flex-col items-center justify-center p-2 transition-transform duration-300 hover:-translate-y-1 sm:p-3"
    >
      {/* Top-right verified pip */}
      {isVerified && (
        <span
          aria-label="موثّق"
          className="absolute end-1 top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-success text-success-foreground shadow-soft-sm"
        >
          <ShieldCheck className="h-2.5 w-2.5" />
        </span>
      )}

      {/* Top-left branch count */}
      {branchCount > 0 && (
        <span className="absolute start-1 top-1 z-10 inline-flex items-center gap-1 rounded-full bg-foreground/5 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground backdrop-blur-sm">
          <Store className="h-2.5 w-2.5 text-primary" />
          <span className="tabular-nums">{branchCount}</span>
        </span>
      )}

      {/* Logo */}
      <div className="flex h-full w-full items-center justify-center px-2 pt-3 pb-1">
        {logo ? (
          <img
            src={logo}
            alt={`${brand.brandName} logo`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={cn(
              "max-h-[70%] w-auto max-w-[85%] object-contain object-center transition-transform duration-500 ease-out group-hover:scale-110",
            )}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="font-display text-3xl font-bold text-foreground/70 transition-colors group-hover:text-primary">
            {brand.brandName.slice(0, 1)}
          </span>
        )}
      </div>

      {/* Brand name */}
      <span className="mt-1 line-clamp-1 w-full text-center text-[11px] font-semibold text-muted-foreground transition-colors group-hover:text-foreground sm:text-xs">
        {brand.brandName}
      </span>
    </Link>
  );
}