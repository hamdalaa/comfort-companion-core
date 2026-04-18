

# تطوير: ألوان نفسية + تجربة Premium Tech + إصلاح Responsive

## الفهم
المستخدم يطلب ٣ تحسينات على التصميم الحالي ("Atlas Editorial" الورقي):
1. **ألوان نفسية تفتح النفس** — ألوان مدروسة علمياً تشجع على التصفح والاستمرار.
2. **تجربة Premium Tech** — يحس المستخدم إنه يستخدم منتج تقني فاخر (Apple/Linear/Vercel level)، مو موقع ورقي تحريري.
3. **إصلاح مشاكل الـ Responsive** — يبدو إن في مشاكل على شاشات معينة (المستخدم حالياً على 390px موبايل).

التضارب: التصميم الحالي ورقي دافئ (Atlas Editorial). طلب "Premium Tech" يعني تحول جذري لاتجاه مختلف تماماً.

## الاتجاه الجديد المقترح — "Tayeh Lumen"
نظام تصميم بريميوم تك بألوان نفسية مدروسة:

### علم نفس الألوان (Color Psychology)
- **الأزرق الهادئ المخضّر** (`#0EA5A4` - Teal/Cyan) كلون أساسي: يخفض ضربات القلب، يزيد التركيز والثقة، يشجع على الاستكشاف. (مستخدم في Stripe, Linear)
- **خلفية بيضاء ناعمة** (`#FAFBFC`) بدل الورق الدافئ: نظافة بصرية، يقلل الإجهاد، Premium feel.
- **رمادي بارد مع لمسة أزرق** للنصوص الثانوية: يخفف التوتر البصري.
- **أكسنت ذهبي/برتقالي دافئ** (`#F59E0B`) للـ CTAs: يحفز الفعل بدون عدوانية.
- **أخضر ناعم** للنجاح/التوثيق: يعطي إحساس بالأمان والثقة.
- تباين عالي WCAG AAA للنصوص.

### لغة Premium Tech
- زوايا ناعمة (rounded-xl 12-16px) بدل الحادة.
- ظلال طبقية ناعمة جداً (Apple-style soft shadows).
- خطوط: **Geist Sans** أو **Inter** للإنجليزية، **IBM Plex Sans Arabic** للعربية بأوزان دقيقة (450-550).
- Micro-interactions: hover states ناعمة، transitions على cubic-bezier(0.4, 0, 0.2, 1).
- Glass morphism خفيف على الـ sticky elements.
- Gradients دقيقة جداً (subtle) بدل الألوان المسطحة.
- مساحات تنفس واسعة (generous whitespace).

## ما سيتغير

### ١. نظام الألوان (`src/index.css`)
إعادة كتابة CSS variables بالكامل:
- خلفية بيضاء/رمادية فاتحة جداً
- Primary: Teal (`hsl(178 75% 35%)`)
- Accent: Amber دافئ
- Surfaces متعددة الطبقات (surface, surface-2, surface-elevated)
- ظلال متدرجة (sm, md, lg, xl, 2xl) بنمط Apple
- إزالة paper grain، استبداله بـ subtle dot pattern أو نظافة كاملة
- خطوط جديدة: Inter + IBM Plex Sans Arabic + JetBrains Mono للأرقام

### ٢. مكونات أساسية محدّثة
- `TopNav.tsx` — Glass effect على scroll، شعار أنظف، hover states ناعمة.
- `HeroBanner.tsx` — Gradient mesh background خفيف، عناوين بـ tracking-tight، CTA بـ glow ناعم.
- `HeroSearch.tsx` — Border ناعم، focus ring بـ teal، rounded-2xl.
- `ShopCard.tsx` / `BrandCard.tsx` / `CityShopCard.tsx` — rounded-2xl، ظلال طبقية، hover lift ناعم.
- `MetricsStrip.tsx` — أرقام بـ JetBrains Mono، gradient text خفيف.
- `Badges.tsx` — pills ناعمة بـ semi-transparent backgrounds.
- `SiteFooter.tsx` — خلفية داكنة ناعمة (slate-950) مع نص فاتح.
- `HowItWorks.tsx` — أيقونات داخل دوائر gradient ناعمة.

### ٣. إصلاح Responsive
- مراجعة كل المكونات على breakpoints: 320, 375, 390, 768, 1024, 1280, 1440.
- إصلاح الـ container paddings (الحالي قد يضيق على شاشات صغيرة).
- إصلاح الـ Hero على الموبايل (العنوان قد يكون كبير جداً).
- جعل grid columns أكثر مرونة (1 col موبايل، 2 tablet، 3-4 desktop).
- إصلاح horizontal overflow إن وجد.
- الـ TopNav: drawer/sheet على الموبايل بدل الروابط المضغوطة.
- `Index.tsx`, `StreetPage.tsx`, `CityPage.tsx`, `Brands.tsx` — مراجعة spacing.

### ٤. تحديثات Tailwind (`tailwind.config.ts`)
- إضافة fontFamily الجديدة (sans: Inter, arabic: Plex Arabic, mono: JetBrains Mono).
- إضافة keyframes/animations جديدة (subtle-pulse, gradient-flow, fade-up-soft).
- إضافة easing functions (ease-premium).

### ٥. التطبيق على كل الصفحات
- `Index.tsx` — تطبيق نظام الألوان الجديد، فحص spacing.
- `StreetPage.tsx`, `Brands.tsx`, `Brand.tsx`, `Results.tsx`, `IraqCities.tsx`, `CityPage.tsx`, `CityShopView.tsx`, `ShopView.tsx` — تطبيق الـ tokens الجديدة.
- `Dashboard.tsx` — يبقى وظيفياً مع تحديث بصري خفيف.

## خارج النطاق
- لا تغيير في منطق البيانات أو search/ranking.
- لا إضافة features جديدة.
- لا تغيير في الـ routing.

## مراحل التنفيذ
1. **نظام الألوان والخطوط** (`index.css` + `tailwind.config.ts`).
2. **المكونات الأساسية** (TopNav, Hero, Search, Cards, Footer).
3. **مراجعة Responsive** على كل breakpoints مع إصلاحات spacing/layout.
4. **تطبيق على بقية الصفحات**.
5. **QA نهائي** على 375px و 1280px.

