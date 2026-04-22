import { useDeferredValue, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Search, Tag } from "lucide-react";
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
        className="group/search relative w-full overflow-visible rounded-2xl border border-border/70 bg-card/95 p-2 shadow-soft backdrop-blur-xl transition-all focus-within:border-primary/40 focus-within:shadow-soft-lg sm:rounded-[1.4rem]"
      >
        {/* Single unified row on desktop, stacks on mobile */}
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-1.5">
          {/* Search input — takes remaining space */}
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 sm:rounded-[1rem] sm:px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={q}
              onChange={(event) => { setQ(event.target.value); setAcOpen(true); setAcIndex(-1); }}
              onFocus={() => {
                setAcOpen(true);
                void prefetchProductIndex();
              }}
              onBlur={() => setTimeout(() => setAcOpen(false), 150)}
              onKeyDown={onInputKeyDown}
              placeholder="iPhone 15، PlayStation 5، اسم محل…"
              className="h-11 min-w-0 flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground/60 sm:h-12 sm:text-[15px]"
              autoComplete="off"
            />
          </div>

          {/* Vertical divider on desktop */}
          <div aria-hidden className="hidden h-8 w-px self-center bg-border/70 sm:block" />

          {/* Category */}
          <Select value={category} onValueChange={(value) => setCategory(value as Category | "all")}>
            <SelectTrigger className="h-11 w-full min-w-0 rounded-xl border-0 bg-transparent px-3 text-[13px] text-foreground shadow-none transition-colors hover:bg-muted/40 focus:ring-2 focus:ring-primary/30 sm:h-12 sm:w-40 sm:rounded-[1rem] sm:text-sm">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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

          <div aria-hidden className="hidden h-8 w-px self-center bg-border/70 sm:block" />

          {/* Area */}
          <Select value={area} onValueChange={(value) => setArea(value as Area | "all")}>
            <SelectTrigger className="h-11 w-full min-w-0 rounded-xl border-0 bg-transparent px-3 text-[13px] text-foreground shadow-none transition-colors hover:bg-muted/40 focus:ring-2 focus:ring-primary/30 sm:h-12 sm:w-40 sm:rounded-[1rem] sm:text-sm">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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

          {/* CTA — gradient pill */}
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full shrink-0 gap-1.5 rounded-xl bg-gradient-to-l from-violet via-primary to-cyan px-5 text-[13px] font-semibold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg sm:h-12 sm:w-auto sm:rounded-[1rem] sm:px-6 sm:text-sm"
          >
            <Search className="h-4 w-4" />
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
