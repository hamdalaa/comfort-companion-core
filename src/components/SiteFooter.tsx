import { Link } from "react-router-dom";
import { ArrowUp, Compass, MapPin, Tag, Building2 } from "lucide-react";

const columns = [
  {
    title: "استكشاف",
    icon: Compass,
    links: [
      { to: "/", label: "الرئيسية" },
      { to: "/results", label: "كل المنتجات" },
      { to: "/brands", label: "الوكلاء" },
      { to: "/iraq", label: "المحافظات" },
    ],
  },
  {
    title: "الشوارع",
    icon: MapPin,
    links: [
      { to: "/sinaa", label: "شارع الصناعة" },
      { to: "/rubaie", label: "شارع الربيعي" },
      { to: "/results?category=PC%20Parts", label: "قطع PC" },
      { to: "/results?category=Networking", label: "الشبكات" },
    ],
  },
  {
    title: "الفئات",
    icon: Tag,
    links: [
      { to: "/results?category=Phones", label: "الهواتف" },
      { to: "/results?category=Chargers", label: "الشواحن" },
      { to: "/results?category=Gaming", label: "الألعاب" },
      { to: "/results?category=Cameras", label: "الكاميرات" },
    ],
  },
  {
    title: "المنصة",
    icon: Building2,
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
    <footer className="relative mt-20 border-t border-border bg-card text-foreground">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="رجوع للأعلى"
        className="ios-tap fixed bottom-5 right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft-lg backdrop-blur-md transition-transform hover:-translate-y-0.5 hover:text-primary md:bottom-6 md:right-6 md:h-12 md:w-12"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <div className="container py-14 md:py-20">
        {/* Masthead block */}
        <div className="grid gap-10 border-b border-border pb-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="text-right">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-soft-md">
                <span className="font-display text-2xl font-bold leading-none text-primary-foreground">ت</span>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold leading-none text-foreground md:text-4xl">حاير</div>
                <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Hayer — Iraqi Electronics Atlas
                </div>
              </div>
            </Link>

            <p className="mt-6 max-w-[48rem] text-sm leading-7 text-muted-foreground">
              حاير مو متجر، بل طبقة توجيه أوضح فوق سوق الإلكترونيات العراقي: محلات،
              منتجات، محافظات، ووكلاء رسميون ضمن تجربة واحدة تركّز على القرار السريع
              والثقة قبل الخروج من البيت.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/results"
                className="ios-tap inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                ابدأ البحث ←
              </Link>
              <Link
                to="/iraq"
                className="ios-tap inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                المحافظات ←
              </Link>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {columns.map((column) => (
              <div key={column.title} className="min-w-0 text-right">
                <div className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80 sm:tracking-[0.22em]">
                  {column.title}
                </div>
                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {column.links.map((link) => (
                    <li key={link.to} className="min-w-0">
                      <Link
                        to={link.to}
                        className="block truncate text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-center md:flex-row md:items-center md:justify-between md:text-right">
          <p className="text-xs leading-6 text-muted-foreground">
            البيانات مبنية على آخر فهرسة متاحة وليست تحديثاً لحظياً.
          </p>
          <p className="font-numeric text-xs text-muted-foreground tabular-stable">© {new Date().getFullYear()} Hayer</p>
        </div>
      </div>
    </footer>
  );
}
