import { useEffect, useState } from "react";
import { X, Truck, ShieldCheck, Store, RefreshCw } from "lucide-react";

const STORAGE_KEY = "atlas-announcement-dismissed-v1";

const messages = [
  { icon: Truck, text: "توصيل سريع لكل المحافظات" },
  { icon: ShieldCheck, text: "ضمان سنة على المنتجات الموثّقة" },
  { icon: Store, text: "أكثر من 1,200 محل ميداني موثوق" },
  { icon: RefreshCw, text: "تحديث يومي للأسعار والمخزون" },
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleClose = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* noop */
    }
  };

  if (dismissed) return null;

  // Duplicate the list so the marquee loop is seamless
  const loop = [...messages, ...messages];

  return (
    <div className="relative z-40 overflow-hidden border-b border-primary/20 bg-gradient-to-r from-primary via-primary to-primary-glow text-primary-foreground">
      <div className="container relative flex items-center gap-3 py-2 sm:py-2.5">
        <div className="group/marquee relative flex-1 overflow-hidden">
          <div
            className="flex w-max items-center gap-10 animate-marquee group-hover/marquee:[animation-play-state:paused]"
            style={{ animationDuration: "38s" }}
          >
            {loop.map((m, i) => {
              const Icon = m.icon;
              return (
                <span key={i} className="flex shrink-0 items-center gap-2 text-[12px] font-medium sm:text-[13px]">
                  <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" />
                  <span>{m.text}</span>
                  <span aria-hidden className="ms-6 h-1 w-1 rounded-full bg-primary-foreground/40" />
                </span>
              );
            })}
          </div>
          {/* Edge fades */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-10 bg-gradient-to-l from-transparent to-primary/95" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 w-10 bg-gradient-to-r from-transparent to-primary/95" />
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="إغلاق"
          className="shrink-0 rounded-full p-1 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}