import { useState } from "react";
import { ChevronDown, Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { cn, formatCompact } from "@/lib/utils";
import type { ShopSearchFilters } from "@/lib/unifiedSearch";

interface FacetItem {
  key: string;
  label: string;
  count: number;
}

interface Props {
  facets: { areas: FacetItem[]; categories: FacetItem[] };
  value: ShopSearchFilters;
  onChange: (next: ShopSearchFilters) => void;
  onReset: () => void;
  className?: string;
  triggerLabel?: string;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 py-5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-start text-[13px] font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:text-foreground"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground/70 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="mt-3 animate-fade-in space-y-1">{children}</div>}
    </div>
  );
}

function FacetList({
  items,
  selected,
  onToggle,
  max = 8,
}: {
  items: FacetItem[];
  selected: string[];
  onToggle: (key: string) => void;
  max?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, max);
  if (!items.length) return <p className="px-2 py-1 text-xs text-muted-foreground">لا توجد خيارات</p>;
  return (
    <div className="space-y-0.5">
      {visible.map((item) => (
        <label
          key={item.key}
          className="group flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-surface/60"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Checkbox
              checked={selected.includes(item.key)}
              onCheckedChange={() => onToggle(item.key)}
            />
            <span className="truncate text-[13px] text-foreground/90 group-hover:text-foreground sm:text-sm">
              {item.label}
            </span>
          </div>
          <span className="ms-2 shrink-0 tabular-nums text-[11px] font-medium text-muted-foreground/70">
            {formatCompact(item.count)}
          </span>
        </label>
      ))}
      {items.length > max && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="ms-2 mt-1 text-[12px] font-medium text-primary transition-opacity hover:opacity-70"
        >
          {showAll ? "عرض أقل" : `+${items.length - max} المزيد`}
        </button>
      )}
    </div>
  );
}

function FilterBody({ facets, value, onChange, onReset }: Omit<Props, "className" | "triggerLabel">) {
  function toggle(key: "categories" | "cities", item: string) {
    const arr = (value[key] as string[] | undefined) ?? [];
    const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
    onChange({ ...value, [key]: next.length ? next : undefined });
  }

  const activeCount =
    (value.categories?.length ?? 0) +
    (value.cities?.length ?? 0) +
    (value.verifiedOnly ? 1 : 0) +
    (value.hasPhone ? 1 : 0) +
    (value.hasWebsite ? 1 : 0);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground">
            فلاتر المحلات
          </h3>
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold tabular-nums text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" />
            مسح الكل
          </button>
        )}
      </div>

      <Section title="الحالة">
        <SwitchRow
          id="sf-verified"
          label="محل موثّق"
          checked={!!value.verifiedOnly}
          onChange={(v) => onChange({ ...value, verifiedOnly: v || undefined })}
        />
        <SwitchRow
          id="sf-phone"
          label="يحتوي على رقم"
          checked={!!value.hasPhone}
          onChange={(v) => onChange({ ...value, hasPhone: v || undefined })}
        />
        <SwitchRow
          id="sf-web"
          label="عنده موقع/متجر"
          checked={!!value.hasWebsite}
          onChange={(v) => onChange({ ...value, hasWebsite: v || undefined })}
        />
      </Section>

      <Section title="التصنيف">
        <FacetList
          items={facets.categories}
          selected={value.categories ?? []}
          onToggle={(k) => toggle("categories", k)}
        />
      </Section>

      <Section title="الشارع / المنطقة">
        <FacetList
          items={facets.areas}
          selected={value.cities ?? []}
          onToggle={(k) => toggle("cities", k)}
        />
      </Section>
    </div>
  );
}

function SwitchRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-surface/60"
    >
      <Label htmlFor={id} className="cursor-pointer text-[13px] text-foreground/90 sm:text-sm">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

export function ShopFilters(props: Props) {
  const { className, triggerLabel = "الفلاتر" } = props;
  const activeCount =
    (props.value.categories?.length ?? 0) +
    (props.value.cities?.length ?? 0) +
    (props.value.verifiedOnly ? 1 : 0) +
    (props.value.hasPhone ? 1 : 0) +
    (props.value.hasWebsite ? 1 : 0);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:block", className)}>
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl bg-card p-5 shadow-[0_1px_2px_hsl(220_40%_20%/0.04),0_8px_24px_-8px_hsl(220_40%_20%/0.08)]">
          <FilterBody {...props} />
        </div>
      </aside>

      {/* Mobile sheet trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 rounded-full px-4 lg:hidden">
            <Filter className="me-2 h-4 w-4" />
            {triggerLabel}
            {activeCount > 0 && (
              <Badge className="ms-2 h-5 min-w-5 rounded-full bg-primary px-1.5 text-[10px] tabular-nums">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] max-w-md overflow-y-auto p-0">
          <SheetHeader className="border-b border-border/40 p-5">
            <SheetTitle className="text-[15px] font-semibold">فلاتر المحلات</SheetTitle>
          </SheetHeader>
          <div className="p-5 pb-28">
            <FilterBody {...props} />
          </div>
          <SheetFooter className="sticky bottom-0 border-t border-border/40 bg-background/90 p-4 backdrop-blur-md">
            <Button onClick={props.onReset} variant="outline" className="flex-1 rounded-full">
              إعادة ضبط
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
