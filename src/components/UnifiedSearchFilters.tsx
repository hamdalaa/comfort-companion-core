import { useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { cn, formatCompact } from "@/lib/utils";
import type { UnifiedSearchFilters as Filters, UnifiedSearchResponse } from "@/lib/unifiedSearch";
import { formatIQD } from "@/lib/unifiedSearch";

interface Props {
  facets: UnifiedSearchResponse["facets"];
  value: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  className?: string;
  /** mobile drawer trigger */
  triggerLabel?: string;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 py-5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between text-start text-[13px] font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:text-foreground"
      >
        {title}
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:text-foreground", open && "rotate-180")} />
      </button>
      {open && <div className="mt-4 space-y-1 animate-fade-in">{children}</div>}
    </div>
  );
}

function FacetList({
  items,
  selected,
  onToggle,
  max = 6,
}: {
  items: { key: string; label: string; count: number }[];
  selected: string[];
  onToggle: (key: string) => void;
  max?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, max);
  if (!items.length) return <p className="text-xs text-muted-foreground">لا توجد خيارات</p>;
  return (
    <div className="space-y-0.5">
      {visible.map((item) => (
        <label
          key={item.key}
          className="group/item flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-surface/60"
        >
          <div className="flex items-center gap-2.5">
            <Checkbox
              checked={selected.includes(item.key)}
              onCheckedChange={() => onToggle(item.key)}
            />
            <span className="text-[13px] font-medium text-foreground/85 transition-colors group-hover/item:text-foreground">{item.label}</span>
          </div>
          <span className="tabular-nums text-[11px] font-medium text-muted-foreground/70">{formatCompact(item.count)}</span>
        </label>
      ))}
      {items.length > max && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="ms-2 mt-1 text-[12px] font-semibold text-primary transition-opacity hover:opacity-70"
        >
          {showAll ? "عرض أقل" : `+${items.length - max} المزيد`}
        </button>
      )}
    </div>
  );
}

function FilterBody({ facets, value, onChange, onReset }: Omit<Props, "className" | "triggerLabel">) {
  const [priceLocal, setPriceLocal] = useState<[number, number]>([
    value.priceMin ?? facets.priceRange.min,
    value.priceMax ?? facets.priceRange.max,
  ]);

  function toggle<K extends keyof Filters>(key: K, item: string) {
    const arr = (value[key] as string[] | undefined) ?? [];
    const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
    onChange({ ...value, [key]: next.length ? next : undefined });
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[15px] font-bold tracking-tight text-foreground">الفلاتر</h3>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3 w-3" />
          مسح الكل
        </button>
      </div>

      <Section title="السعر (د.ع)">
        <Slider
          min={facets.priceRange.min}
          max={facets.priceRange.max}
          step={10000}
          value={priceLocal}
          onValueChange={(v) => setPriceLocal(v as [number, number])}
          onValueCommit={(v) => onChange({ ...value, priceMin: v[0], priceMax: v[1] })}
          className="mt-3"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-surface/60 px-2 py-1 tabular-nums text-[11px] font-semibold text-foreground/80">{formatIQD(priceLocal[0])}</span>
          <span className="h-px flex-1 bg-border/60" aria-hidden />
          <span className="rounded-md bg-surface/60 px-2 py-1 tabular-nums text-[11px] font-semibold text-foreground/80">{formatIQD(priceLocal[1])}</span>
        </div>
      </Section>

      <Section title="التوفر والحالة">
        <div className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-surface/60">
          <Label htmlFor="f-instock" className="cursor-pointer text-[13px] font-medium text-foreground/85">متوفر فقط</Label>
          <Switch
            id="f-instock"
            checked={!!value.inStockOnly}
            onCheckedChange={(v) => onChange({ ...value, inStockOnly: v })}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-surface/60">
          <Label htmlFor="f-onsale" className="cursor-pointer text-[13px] font-medium text-foreground/85">عليه تخفيض</Label>
          <Switch
            id="f-onsale"
            checked={!!value.onSaleOnly}
            onCheckedChange={(v) => onChange({ ...value, onSaleOnly: v })}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-surface/60">
          <Label htmlFor="f-verified" className="cursor-pointer text-[13px] font-medium text-foreground/85">محل موثّق</Label>
          <Switch
            id="f-verified"
            checked={!!value.verifiedOnly}
            onCheckedChange={(v) => onChange({ ...value, verifiedOnly: v })}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-surface/60">
          <Label htmlFor="f-official" className="cursor-pointer text-[13px] font-medium text-foreground/85">وكيل رسمي</Label>
          <Switch
            id="f-official"
            checked={!!value.officialDealerOnly}
            onCheckedChange={(v) => onChange({ ...value, officialDealerOnly: v })}
          />
        </div>
      </Section>

      <Section title="البراند">
        <FacetList
          items={facets.brands}
          selected={value.brands ?? []}
          onToggle={(k) => toggle("brands", k)}
        />
      </Section>

      <Section title="الفئة">
        <FacetList
          items={facets.categories}
          selected={value.categories ?? []}
          onToggle={(k) => toggle("categories", k)}
        />
      </Section>

      <Section title="المحل">
        <FacetList
          items={facets.stores}
          selected={value.stores ?? []}
          onToggle={(k) => toggle("stores", k)}
        />
      </Section>

      <Section title="المدينة">
        <FacetList
          items={facets.cities}
          selected={value.cities ?? []}
          onToggle={(k) => toggle("cities", k)}
        />
      </Section>
    </div>
  );
}

export function UnifiedSearchFilters(props: Props) {
  const { className, triggerLabel = "الفلاتر" } = props;
  const activeCount =
    (props.value.brands?.length ?? 0) +
    (props.value.categories?.length ?? 0) +
    (props.value.stores?.length ?? 0) +
    (props.value.cities?.length ?? 0) +
    (props.value.inStockOnly ? 1 : 0) +
    (props.value.onSaleOnly ? 1 : 0) +
    (props.value.verifiedOnly ? 1 : 0) +
    (props.value.officialDealerOnly ? 1 : 0);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:block", className)}>
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-soft-sm">
          <FilterBody {...props} />
        </div>
      </aside>

      {/* Mobile sheet trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden">
            <Filter className="me-2 h-4 w-4" />
            {triggerLabel}
            {activeCount > 0 && (
              <Badge className="ms-2 h-5 min-w-5 rounded-full bg-primary px-1.5 text-[10px]">{activeCount}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[88vw] max-w-md overflow-y-auto p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>الفلاتر</SheetTitle>
          </SheetHeader>
          <div className="p-4 pb-24">
            <FilterBody {...props} />
          </div>
          <SheetFooter className="sticky bottom-0 border-t border-border bg-background p-4">
            <Button onClick={props.onReset} variant="outline" className="flex-1">إعادة ضبط</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
