/**
 * TrustBadges — 4 reassurance pills shown right under the price block on
 * ProductDetail. Static, brand-neutral copy in Arabic that matches Iraq
 * commerce expectations (warranty, country-wide shipping, returns, COD).
 */
import { CreditCard, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    label: "ضمان الوكيل",
    sub: "أصلي ومضمون",
    tone: "text-accent-emerald bg-accent-emerald/10",
  },
  {
    icon: Truck,
    label: "توصيل لكل المحافظات",
    sub: "خلال 1-3 أيام",
    tone: "text-primary bg-primary/10",
  },
  {
    icon: RefreshCcw,
    label: "7 أيام استبدال",
    sub: "حسب سياسة المحل",
    tone: "text-accent-violet bg-accent-violet/10",
  },
  {
    icon: CreditCard,
    label: "دفع عند الاستلام",
    sub: "آمن وموثوق",
    tone: "text-accent-cyan bg-accent-cyan/10",
  },
] as const;

export function TrustBadges() {
  return (
    <ul
      className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
      aria-label="شارات الثقة"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.label}
            className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card p-3 transition-[transform,border-color] hover:-translate-y-0.5 hover:border-border"
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.tone}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-[12px] font-semibold leading-tight text-foreground">
                {item.label}
              </div>
              <div className="truncate text-[10.5px] text-muted-foreground">
                {item.sub}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}