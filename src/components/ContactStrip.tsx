import { Heart, Star, Instagram, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SPONSOR_PERKS = [
  "ظهور دائم لشعارك بالصفحة الرئيسية وشريط التنقّل",
  "بطاقة \"موصى به من راعي\" تتصدّر نتائج البحث",
  "أولوية بقوائم الوكلاء الرسميين والمحلّات الموثّقة",
  "تقرير شهري بإحصائيات الظهور والنقرات",
];

export function ContactStrip() {
  return (
    <section className="container mt-10 space-y-6 sm:mt-20 md:mt-24">
      <div className="group relative overflow-hidden rounded-3xl border border-violet/25 bg-gradient-to-br from-violet/12 via-card to-rose/8 p-6 shadow-soft-lg md:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-rose/15 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet">
            <Heart className="h-3.5 w-3.5" />
            الرعاية والشراكات
          </div>

          <h2 className="font-display mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            صير <span className="bg-gradient-to-r from-violet to-rose bg-clip-text text-transparent">راعي رسمي</span> للمنصّة
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            منصّتنا تخدم آلاف المستخدمين شهرياً بكل محافظات العراق. كون شريكنا، ووصّل علامتك التجارية لجمهور حقيقي يدوّر على منتجاتك.
          </p>

          <div className="mt-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet/90">
              شنو تكسب كراعي؟
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {SPONSOR_PERKS.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card/70 p-3.5 text-sm leading-6 text-foreground/90 backdrop-blur transition-colors hover:border-violet/30"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet">
                    <Star className="h-3 w-3 fill-current" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-muted-foreground sm:text-xs">
              مفتوحين للتعاون مع المتاجر، الوكلاء الرسميين، والشركات التقنية.
            </p>
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full bg-gradient-to-r from-violet to-rose px-6 text-white shadow-soft-md hover:opacity-95 sm:w-auto"
            >
              <a href="https://instagram.com/hamadalaatech" target="_blank" rel="noreferrer noopener">
                <Instagram className="h-4 w-4" />
                تواصل معنا للرعاية
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-soft-md backdrop-blur md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight md:text-xl">
              رعاتنا الحاليين
            </h3>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              شركاء يساندون استمرار المنصّة — مكانك ممكن يكون التالي.
            </p>
          </div>
          <span className="hidden rounded-full border border-violet/25 bg-violet/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet sm:inline-flex">
            متاح
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <a
              key={i}
              href="https://instagram.com/hamadalaatech"
              target="_blank"
              rel="noreferrer noopener"
              className="group/slot relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/70 bg-surface/40 transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:bg-violet/5"
            >
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet/10 text-violet transition-transform group-hover/slot:scale-110">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-foreground">مكانك هنا</span>
                <span className="text-[10px] text-muted-foreground">اضغط للتواصل</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}