import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const columns = [
  {
    title: "استكشاف",
    links: [
      { to: "/", label: "الرئيسية" },
      { to: "/results", label: "كل المنتجات" },
      { to: "/brands", label: "الوكلاء" },
      { to: "/iraq", label: "المحافظات" },
    ],
  },
  {
    title: "الشوارع",
    links: [
      { to: "/sinaa", label: "شارع الصناعة" },
      { to: "/rubaie", label: "شارع الربيعي" },
      { to: "/results?category=PC%20Parts", label: "قطع PC" },
      { to: "/results?category=Networking", label: "الشبكات" },
    ],
  },
  {
    title: "الفئات",
    links: [
      { to: "/results?category=Phones", label: "الهواتف" },
      { to: "/results?category=Chargers", label: "الشواحن" },
      { to: "/results?category=Gaming", label: "الألعاب" },
      { to: "/results?category=Cameras", label: "الكاميرات" },
    ],
  },
  {
    title: "المنصة",
    links: [
      { to: "/about", label: "عن حاير" },
      { to: "/dashboard", label: "لوحة الإدارة" },
      { to: "/brand/apple", label: "Apple" },
      { to: "/brand/samsung", label: "Samsung" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-20 bg-background text-foreground">
      {/* Premium gradient seam at top */}
      <div aria-hidden className="divider-grad" />
      {/* Soft section spotlight backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60 bg-gradient-spotlight" />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="رجوع للأعلى"
        className="ios-tap fixed bottom-5 right-3 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground shadow-soft backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground md:bottom-6 md:right-6 md:h-11 md:w-11"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <div className="container py-12 md:py-16">
        {/* Masthead — minimal */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div className="text-right">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-ocean text-primary-foreground shadow-glow">
                <span className="font-display text-lg font-bold leading-none">ت</span>
              </div>
              <div className="font-thmanyah text-2xl font-bold leading-none text-grad-ocean">حـايـر</div>
            </Link>

            <p className="mt-5 max-w-sm text-[13px] leading-6 text-muted-foreground">
              طبقة توجيه أوضح فوق سوق الإلكترونيات العراقي — محلات، منتجات، محافظات، ووكلاء رسميون.
            </p>
          </div>

          {/* Columns — clean grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title} className="min-w-0 text-right">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/90">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.to} className="min-w-0">
                      <Link
                        to={link.to}
                        className="inline-block text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="truncate">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12 flex flex-col gap-2 pt-6 text-center md:flex-row md:items-center md:justify-between md:text-right">
          <div aria-hidden className="absolute inset-x-0 top-0 divider-grad opacity-70" />
          <p className="text-[11px] leading-5 text-muted-foreground">
            البيانات مبنية على آخر فهرسة متاحة وليست تحديثاً لحظياً.
          </p>
          <p className="font-numeric text-[11px] text-muted-foreground tabular-stable">
            © {new Date().getFullYear()} Hayer
          </p>
        </div>
      </div>
    </footer>
  );
}
