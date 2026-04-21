

# مستوحى من تصميم متجر النبأ — تحسينات الصفحة الرئيسية

## السياق
متجر النبأ هو متجر إلكترونيات عراقي (Shopify) بشكل تجاري واضح: شريط إعلانات متحرك، بانر slideshow كبير، شبكة فئات بصرية ضخمة، ومجموعات منتجات (Product Rails) مفصولة ببانرات ترويجية. موقعنا يفتقد لـ 4 عناصر أساسية موجودة عنده: شريط إعلانات، slideshow بدل صورة hero ثابتة، شبكة فئات بصرية ضخمة (Accessories/Laptops/Printer/Storage)، وبانرات ترويجية بين الـ rails.

## ما سنضيفه (5 عناصر جديدة + تحسينان)

### 1. Announcement Bar (شريط إعلانات متحرك) — جديد
شريط رفيع فوق الـ TopNav بخلفية primary (Cyan/Emerald) يعرض رسائل دوّارة:
- "توصيل لكل العراق" • "ضمان سنة على المنتجات" • "أكثر من 1,200 محل موثوق" • "تحديث يومي للأسعار"
- Animation: marquee أفقي ناعم (CSS) من اليمين لليسار، يتوقف عند hover.
- زرار ✕ لإغلاقه (يحفظ بـ localStorage).

### 2. Hero Slideshow بدل البانر الثابت — تحسين
استبدال صورة بغداد الواحدة بـ **slideshow بـ 3 شرائح** (دوّار تلقائي كل 6 ثواني + dots + arrows):
- شريحة 1: "كل محلات الإلكترونيات بمكان واحد" (الحالية)
- شريحة 2: "قارن أسعار آيفون 15 من 40+ محل" (Deals/Compare)
- شريحة 3: "خرائط شارع الصناعة والربيعي" (Streets)

كل شريحة بصورة مختلفة + CTA واضح. يحافظ على بحث الـ Hero بالأسفل.

### 3. شبكة فئات بصرية ضخمة (Hero Category Tiles) — جديد
بعد الـ Hero مباشرة، شبكة 4 كروت ضخمة بأسلوب النبأ:
```text
┌──────────┬──────────┬──────────┬──────────┐
│ هواتف    │ لابتوبات │ شاشات    │ إكسسوار  │
│ [صورة]   │ [صورة]   │ [صورة]   │ [صورة]   │
│ 320+ محل │ 180+ محل │ 95+ محل  │ 410+ محل │
└──────────┴──────────┴──────────┴──────────┘
```
كروت كبيرة (aspect 4/5) بخلفية gradient ناعمة + صورة فئة + كاونت محلات.
بديل أنظف من `CategoryCircles` الحالية (نُبقيها ضمن قسم "كل الفئات").

### 4. Promo Banner Strip بين الـ Rails — جديد
بانر عريض ترويجي بين "أفضل التخفيضات" و "الأكثر تقييماً" (مستلهم من banner "Peripheral Deals" عندهم):
- خلفية gradient + صورة فئة + headline كبير ("صفقات الإكسسوارات — 40% على الـ Headphones") + CTA.
- بانر ثاني بين "الأكثر تقييماً" و"إضافات حديثة" يقود لشارع الصناعة.

### 5. Brand Strip (شريط براندات أفقي) — جديد
شريط أفقي بـ logos صغيرة قبل قسم "محلات مختارة": Apple, Samsung, Asus, HP, Lenovo, Anker, Ugreen, Xiaomi, Sony, Dell, MSI, Logitech (12 logo). يستخدم `BrandLogoTile` الموجود.

### 6. Trust/Contact Strip قبل الفوتر — جديد
3 كروت أفقية مستلهمة من قسم "Contact Us" عندهم:
- WhatsApp مع رقم
- Call Us
- Get in Touch / Email
بدل ما يكون فوتر فقط.

### 7. ترتيب الصفحة الجديد
```text
1. Announcement Bar (جديد)
2. TopNav (موجود)
3. Hero Slideshow (مُحسَّن)
4. Hero Category Tiles 4× (جديد) ← يحل محل الكروت الـ3 الحالية
5. شبكة فئات كاملة CategoryCircles (موجود)
6. Product Rail: أفضل التخفيضات (موجود)
7. Promo Banner #1 (جديد)
8. Product Rail: الأكثر تقييماً (موجود)
9. Promo Banner #2 (جديد)
10. Product Rail: إضافات حديثة (موجود)
11. Brand Strip (جديد)
12. مسارات بغداد + شوارع (موجود)
13. محلات مختارة (موجود)
14. الوكلاء الرسميون (موجود)
15. Atlas العراق (موجود)
16. Trust/Contact Strip (جديد)
17. SiteFooter (موجود)
```

## التفاصيل التقنية

| ملف | التغيير |
|---|---|
| `src/components/AnnouncementBar.tsx` | **جديد** — marquee + dismissible |
| `src/components/HeroSlideshow.tsx` | **جديد** — يحل محل الـ Hero الثابت داخل `HeroBanner.tsx` |
| `src/components/HeroCategoryTiles.tsx` | **جديد** — 4 كروت ضخمة |
| `src/components/PromoBanner.tsx` | **جديد** — مكون قابل لإعادة الاستخدام (image + headline + CTA) |
| `src/components/BrandStrip.tsx` | **جديد** — شريط أفقي بـ logos |
| `src/components/ContactStrip.tsx` | **جديد** — 3 كروت تواصل قبل الفوتر |
| `src/components/HeroBanner.tsx` | تضمين `HeroSlideshow` بدل الصورة الثابتة، إزالة كروت الـ3 (انتقلت لـ HeroCategoryTiles) |
| `src/components/home/IndexDeferredSections.tsx` | إعادة ترتيب: إضافة HeroCategoryTiles بعد الـ Hero، PromoBanner بين الـ rails، BrandStrip قبل المحلات، ContactStrip قبل الفوتر |
| `src/pages/Index.tsx` | تضمين `<AnnouncementBar />` في الأعلى |
| `src/index.css` | keyframe `marquee-rtl` للـ Announcement Bar |

كل المكونات الجديدة بنفس design system الحالي (الألوان: `primary`, `cyan`, `emerald`، الخطوط: `font-display`، الشعاع: `rounded-3xl`، الظلال: `shadow-soft-*`)، RTL، lazy images، ومتجاوبة (mobile carousel على الكروت الضخمة).

## ما لن نلمسه
- نظام البحث، صفحات النتائج، المنتج، المحل، البراند.
- الـ TopNav والـ BottomTabBar.
- منطق البيانات (`useDataStore`).

