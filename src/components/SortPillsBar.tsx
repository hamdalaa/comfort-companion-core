/**
 * SortPillsBar — quick horizontal sort chips + result count + active-filter
 * pills. Renders above the product grid on /search and other listing pages.
 */
import { ArrowDownAZ, Flame, Sparkles, TrendingDown, X } from "lucide-react";
import type { SortKey } from "@/lib/unifiedSearch";
import { cn } from "@/lib/utils";

const arabicNumber = new Intl.NumberFormat("ar");

export interface SortOption {
  value: SortKey;
  label: string;
  icon?: typeof Flame;
}

const DEFAULT_OPTIONS: SortOption[] = [
  { value: "relevance", label: "الأنسب", icon: Sparkles },
  { value: "price_asc", label: "الأرخص", icon: TrendingDown },
  { value: "rating_desc", label: "الأعلى تقييماً", icon: Flame },
  { value: "freshness_desc", label: "الأحدث", icon: ArrowDownAZ },
  { value: "offers_desc", label: "الأكثر عروضاً", icon: Flame },
];

interface ActiveChip {
  label: string;
  clear: () => void;
}

interface Props {
  sort: SortKey;
  onSortChange: (next: SortKey) => void;
  totalResults?: number;
  options?: SortOption[];
  activeChips?: ActiveChip[];
  onClearAll?: () => void;
  className?: string;
}

export function SortPillsBar({
  sort,
  onSortChange,
  totalResults,
  options = DEFAULT_OPTIONS,
  activeChips = [],
  onClearAll,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 backdrop-blur-sm sm:p-3.5",
        className,
      )}
    >
      {/* Row 1: count + pills */}
      <div className="flex flex-wrap items-center gap-2">
        {typeof totalResults === "number" && (
          <span className="me-1 inline-flex items-center gap-1 rounded-full bg-muted/70 px-3 py-1 text-[11px] font-semibold text-foreground/80">
            <span className="tabular-nums text-foreground">
              {arabicNumber.format(totalResults)}
            </span>
            <span className="text-muted-foreground">نتيجة</span>
          </span>
        )}
        <div
          className="flex flex-1 items-center gap-1.5 overflow-x-auto"
          role="tablist"
          aria-label="ترتيب النتائج"
        >
          {options.map((opt) => {
            const active = sort === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSortChange(opt.value)}
                className={cn(
                  "ios-tap inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-[background-color,color,border-color,transform]",
                  active
                    ? "border-foreground bg-foreground text-background shadow-soft"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-3">
          <span className="me-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            فلاتر فعّالة
          </span>
          {activeChips.map((chip, i) => (
            <button
              key={`${chip.label}-${i}`}
              type="button"
              onClick={chip.clear}
              className="group inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              {chip.label}
              <X className="h-3 w-3 transition-transform group-hover:rotate-90" />
            </button>
          ))}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="ms-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-destructive"
            >
              مسح الكل
            </button>
          )}
        </div>
      )}
    </div>
  );
}