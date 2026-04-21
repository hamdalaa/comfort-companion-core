import { MessageCircle, Phone, Mail, ArrowLeft } from "lucide-react";

const items = [
  {
    icon: MessageCircle,
    kicker: "واتساب",
    title: "تواصل عبر واتساب",
    value: "+964 770 000 0000",
    href: "https://wa.me/9647700000000",
    tone: "from-emerald/20 to-emerald/5 text-emerald",
    iconBg: "bg-emerald/15 text-emerald",
  },
  {
    icon: Phone,
    kicker: "اتصال مباشر",
    title: "اتصل فينا",
    value: "+964 770 111 1111",
    href: "tel:+9647701111111",
    tone: "from-primary/20 to-primary/5 text-primary",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    icon: Mail,
    kicker: "بريد إلكتروني",
    title: "أرسل رسالة",
    value: "support@atlas.iq",
    href: "mailto:support@atlas.iq",
    tone: "from-violet/20 to-violet/5 text-violet",
    iconBg: "bg-violet/15 text-violet",
  },
];

export function ContactStrip() {
  return (
    <section className="container mt-10 sm:mt-20 md:mt-24">
      <div className="mb-5 text-center sm:mb-8">
        <span className="atlas-kicker">تواصل معنا</span>
        <h2 className="font-display mt-2 text-balance text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
          فريقنا حاضر لمساعدتك
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-pretty text-sm leading-7 text-muted-foreground">
          سؤال عن منتج، تأكيد عن محل، أو طلب إضافة — اختر القناة الأنسب وراح نرد بأسرع وقت.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`group press animate-fade-in-up relative flex items-center gap-4 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-bl ${item.tone.split(" ").slice(0, 2).join(" ")} bg-card/60 p-5 text-right shadow-soft-md transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft-xl sm:p-6`}
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} sm:h-14 sm:w-14`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.kicker}
                </div>
                <div className="font-display mt-0.5 truncate text-sm font-semibold text-foreground sm:text-base">
                  {item.title}
                </div>
                <div className="mt-1 truncate font-numeric text-xs text-muted-foreground sm:text-sm" dir="ltr">
                  {item.value}
                </div>
              </div>
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-primary" />
            </a>
          );
        })}
      </div>
    </section>
  );
}