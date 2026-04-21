import { Link } from "react-router-dom";
import { useDataStore } from "@/lib/dataStore";
import { useBrandLogo } from "@/hooks/useBrandLogo";
import type { BrandDealer } from "@/lib/types";

function BrandLogoChip({ brand }: { brand: BrandDealer }) {
  const logo = useBrandLogo(brand.slug, brand.brandName, "default");
  return (
    <Link
      to={`/brand/${brand.slug}`}
      aria-label={brand.brandName}
      className="group flex h-16 w-28 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card px-3 shadow-soft-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-md sm:h-20 sm:w-32"
    >
      {logo ? (
        <img
          src={logo}
          alt={`${brand.brandName} logo`}
          loading="lazy"
          decoding="async"
          className="max-h-[60%] w-auto max-w-[80%] object-contain opacity-75 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="font-display text-base font-bold text-muted-foreground transition-colors group-hover:text-foreground">
          {brand.brandName}
        </span>
      )}
    </Link>
  );
}

export function BrandStrip() {
  const { brands } = useDataStore();
  const list = brands.slice(0, 14);
  if (list.length === 0) return null;

  return (
    <section className="container mt-10 sm:mt-16 md:mt-20">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
        <div>
          <span className="atlas-kicker">شركاؤنا</span>
          <h2 className="font-display mt-2 text-balance text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
            البراندات اللي تثق بيها
          </h2>
        </div>
        <Link
          to="/brands"
          className="link-underline hidden shrink-0 items-center text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:text-primary-glow sm:inline-flex"
        >
          كل الوكلاء ←
        </Link>
      </div>

      <div className="rounded-3xl border border-border/60 bg-gradient-to-l from-card via-background to-card px-3 py-4 shadow-soft sm:px-5 sm:py-6">
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
          {list.map((brand) => (
            <BrandLogoChip key={brand.slug} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}