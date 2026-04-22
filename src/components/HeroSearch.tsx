import { useDeferredValue, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_AREAS, ALL_CATEGORIES, type Area, type Category } from "@/lib/types";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { buildAutocomplete, type AutocompleteSuggestion } from "@/lib/unifiedSearch";
import { useDataStore } from "@/lib/dataStore";

interface Props {
  initialQ?: string;
  initialArea?: Area | "all";
  initialCategory?: Category | "all";
  variant?: "hero" | "compact";
}

const AUTOCOMPLETE_PRODUCT_POOL_LIMIT = 1500;

export function HeroSearch({
  initialQ = "",
  initialArea = "all",
  initialCategory = "all",
}: Props) {
  const nav = useNavigate();
  const { shops, products, prefetchProductIndex } = useDataStore();
  const [q, setQ] = useState(initialQ);
  const [area, setArea] = useState<Area | "all">(initialArea);
  const [category, setCategory] = useState<Category | "all">(initialCategory);

  // Live autocomplete — fires on every keystroke. Cheap (in-memory).
  const [acOpen, setAcOpen] = useState(false);
  const [acIndex, setAcIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const deferredQuery = useDeferredValue(q);
  const autocompleteProducts = useMemo(
    () => (products.length > AUTOCOMPLETE_PRODUCT_POOL_LIMIT
      ? products.slice(0, AUTOCOMPLETE_PRODUCT_POOL_LIMIT)
      : products),
    [products],
  );
  const suggestions: AutocompleteSuggestion[] = useMemo(
    () => buildAutocomplete(deferredQuery, shops, autocompleteProducts, 8),
    [deferredQuery, shops, autocompleteProducts],
  );

  function handleAcSelect(s: AutocompleteSuggestion) {
    setAcOpen(false);
    nav(s.href);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") { setAcOpen(false); return; }
    if (!acOpen || !suggestions.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setAcIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAcIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && acIndex >= 0) {
      e.preventDefault();
      handleAcSelect(suggestions[acIndex]);
    }
  }

  // Form-level Escape handler — close any open select/autocomplete and
  // return focus to the input for a calm, predictable keyboard flow.
  function onFormKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Escape") {
      if (categoryOpen || areaOpen || acOpen) {
        e.preventDefault();
        setCategoryOpen(false);
        setAreaOpen(false);
        setAcOpen(false);
        inputRef.current?.focus();
      }
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());

    // Both modes now route to the unified /search page; "shops" mode passes
    // area/category as filter hints (the unified page will pick them up).
    if (area !== "all") params.set("area", area);
    if (category !== "all") params.set("category", category);
    nav(`/search?${params.toString()}`);
  }

  return (
    <div className="w-full">

      <form
        onSubmit={submit}
        onKeyDown={onFormKeyDown}
        className="group/search relative w-full overflow-visible rounded-2xl border border-border/70 bg-card p-1.5 shadow-[0_4px_24px_-8px_hsl(var(--foreground)/0.08)] transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.18)] focus-within:ring-2 focus-within:ring-primary/15 sm:rounded-[1.4rem] sm:p-2"
      >
        {/* Single unified row on desktop, stacks on mobile */}
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-1">
          {/* Search input — takes remaining space */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3.5 sm:rounded-[1rem] sm:px-4">
            <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground/70" strokeWidth={2.2} />
            <input
              ref={inputRef}
              tabIndex={1}
              aria-label="ابحث عن منتج، براند أو محل"
              value={q}
              onChange={(event) => { setQ(event.target.value); setAcOpen(true); setAcIndex(-1); }}
              onFocus={() => {
                setAcOpen(true);
                void prefetchProductIndex();
              }}
              onBlur={() => setTimeout(() => setAcOpen(false), 150)}
              onKeyDown={onInputKeyDown}
              placeholder="iPhone 15، PlayStation 5، اسم محل…"
              className="h-[52px] min-w-0 flex-1 bg-transparent text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-[15px]"
              autoComplete="off"
            />
            {!q && (
              <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-border/70 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground/70 sm:inline-flex">
                <span className="text-[11px]">⌘</span>K
              </kbd>
            )}
          </div>

          {/* Vertical divider on desktop */}
          <div aria-hidden className="hidden h-7 w-px self-center bg-border/60 sm:block" />

          {/* Category */}
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as Category | "all")}
            open={categoryOpen}
            onOpenChange={setCategoryOpen}
          >
            <SelectTrigger
              tabIndex={2}
              aria-label="اختر الفئة"
              className="h-[52px] min-h-[44px] w-full min-w-0 rounded-xl border-0 bg-transparent px-3.5 text-[13px] text-foreground shadow-none transition-all duration-200 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-40 sm:rounded-[1rem] sm:text-[13.5px]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Tag className="h-[15px] w-[15px] shrink-0 text-muted-foreground/70" strokeWidth={2.2} />
                <span className="truncate"><SelectValue placeholder="كل الفئات" /></span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">كل الفئات</SelectItem>
              {ALL_CATEGORIES.map((entry) => (
                <SelectItem key={entry} value={entry}>{entry}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div aria-hidden className="hidden h-7 w-px self-center bg-border/60 sm:block" />

          {/* Area */}
          <Select
            value={area}
            onValueChange={(value) => setArea(value as Area | "all")}
            open={areaOpen}
            onOpenChange={setAreaOpen}
          >
            <SelectTrigger
              tabIndex={3}
              aria-label="اختر المنطقة"
              className="h-[52px] min-h-[44px] w-full min-w-0 rounded-xl border-0 bg-transparent px-3.5 text-[13px] text-foreground shadow-none transition-all duration-200 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-40 sm:rounded-[1rem] sm:text-[13.5px]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <MapPin className="h-[15px] w-[15px] shrink-0 text-muted-foreground/70" strokeWidth={2.2} />
                <span className="truncate"><SelectValue placeholder="كل المناطق" /></span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">كل المناطق</SelectItem>
              {ALL_AREAS.map((entry) => (
                <SelectItem key={entry} value={entry}>{entry}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* CTA — solid primary, Linear-style refined */}
          <Button
            type="submit"
            size="lg"
            tabIndex={4}
            className="h-[52px] w-full shrink-0 gap-2 rounded-xl bg-foreground px-6 text-[13.5px] font-semibold text-background shadow-[0_4px_16px_-4px_hsl(var(--foreground)/0.25)] transition-all duration-300 hover:-translate-y-px hover:opacity-95 hover:shadow-[0_8px_24px_-6px_hsl(var(--foreground)/0.35)] sm:w-auto sm:rounded-[1rem] sm:px-7 sm:text-[14px]"
          >
            <Search className="h-4 w-4" strokeWidth={2.4} />
            ابحث
          </Button>
        </div>

        {/* Live autocomplete dropdown */}
        {acOpen && (
          <SearchAutocomplete
            query={q}
            suggestions={suggestions}
            highlightedIndex={acIndex}
            onHover={setAcIndex}
            onSelect={handleAcSelect}
            onSubmitQuery={() => { setAcOpen(false); submit(new Event("submit") as unknown as FormEvent); }}
          />
        )}
      </form>
    </div>
  );
}
