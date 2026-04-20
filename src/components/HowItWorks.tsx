import { Search, Layers, MapPin } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "حدّد الحاجة",
    desc: "اكتب اسم المنتج أو اختَر الفئة لتبدأ من نتيجة أقرب لطلبك.",
  },
  {
    icon: Layers,
    title: "افرز الخيارات",
    desc: "التصنيف، التقييم، وروابط المحلات بقراءة أسرع من التصفح اليدوي.",
  },
  {
    icon: MapPin,
    title: "افتح الطريق",
    desc: "كمّل من نفس البطاقة إلى خرائط Google أو صفحة المحل بدون خطوات مشتتة.",
  },
];

export function HowItWorks() {
  return (
    <section className="atlas-panel p-6 md:p-8">
      <div className="text-right">
        <span className="atlas-kicker">كيف يعمل حاير</span>
        <h2 className="font-display mt-3 text-2xl font-semibold leading-tight text-foreground">ثلاث خطوات واضحة</h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <article
            key={s.title}
            className="rounded-2xl border border-border bg-card p-5 text-right transition-all hover:border-foreground/15 hover:shadow-soft-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground">
                <s.icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="font-numeric text-2xl font-semibold leading-none tabular-stable text-muted-foreground/40">
                0{i + 1}
              </div>
            </div>
            <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-foreground">
              {s.title}
            </h3>
            <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
