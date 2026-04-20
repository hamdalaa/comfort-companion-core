

# خطة تطوير الـUI الحالي — مودرن، تفاعلي، ومرتّب

نخلي التصميم الحالي كأساس، ونضيف عليه طبقات Polish + تفاعلية + مميزات صغيرة ذكية. بدون كسر هوية الموقع أو تغيير الألوان الأساسية.

---

## 🎨 المرحلة 1: Polish بصري (Design System)

**الهدف**: نعطي الموقع إحساس "premium" بدون تغيير الهوية.

- **Typography hierarchy محسّن**: عناوين أكبر مع `letter-spacing` أدق، نصوص ثانوية أهدأ بـ`leading` أوسع
- **Spacing rhythm**: مسافات أكثر تنفساً بين الأقسام (`mt-32` بدل `mt-20` على الديسكتوب)
- **Gradient borders ناعمة** على البطاقات المميزة (Brand cards, Featured shops)
- **Glow effects خفيفة** على الأسعار، الأزرار الرئيسية، والـbadges المهمة
- **Shadows متدرّجة**: نظام `shadow-soft` → `shadow-soft-md` → `shadow-soft-xl` مطبّق بانسجام
- **Rounded corners موحّدة**: 16px للبطاقات، 24px للحاويات الكبيرة، 999px للـpills

## ⚡ المرحلة 2: Micro-interactions & Animations

**الهدف**: كل عنصر يحس "حي" عند التفاعل.

- **Press feedback**: زر/بطاقة ينضغط بسلاسة (`scale-[0.98]`) عند الضغط
- **Hover lift**: البطاقات ترتفع 2px مع shadow أعمق عند المرور
- **Scroll-triggered reveals**: الأقسام تظهر تدريجياً مع `IntersectionObserver` (fade + slide-up خفيف)
- **Parallax خفيف** على صور الـHero والـbanners (محدود حتى لا يشوّش)
- **Skeleton shimmer**: استبدال الـpulse الحالي بـshimmer effect أنعم
- **Number count-up** للمؤشرات في `MetricsStrip` (موجود `CountUp` — نفعّله)
- **Smooth scroll** بين أقسام الصفحة الواحدة
- **Icon nudges**: السهم في "عرض الكل" يتحرك يميناً عند hover (موجود جزئياً — نوسّعه)

## ✨ المرحلة 3: مميزات تفاعلية جديدة

**الهدف**: نضيف قيمة وظيفية بدون تعقيد الـUI.

- **Quick View modal** على بطاقة المنتج: أيقونة 👁️ تفتح dialog سريع بصور + سعر + زر "فتح الصفحة" بدون مغادرة المكان
- **Sticky filters ذكية**: في `/search` و`/results`، الفلاتر تختفي عند النزول وترجع عند الصعود (scroll direction detect)
- **Recently viewed strip**: شريط أسفل الصفحات يعرض آخر 6 منتجات شفتها (محفوظة في `localStorage`)
- **Compare bar محسّن**: bar سفلي ثابت يظهر عند اختيار منتجين+، مع زر "قارن الآن"
- **Keyboard shortcuts**: `⌘K` / `Ctrl+K` يفتح `CommandPalette` (موجود — نربطه)، `/` للتركيز على البحث، `Esc` للإغلاق
- **Hover preview على بطاقات المحلات**: tooltip سريع يعرض ساعات العمل + عدد المنتجات + رابط الخريطة
- **Wishlist ❤️**: زر قلب على بطاقة المنتج، محفوظ في `localStorage`، صفحة `/wishlist` بسيطة

## 📐 المرحلة 4: تحسينات Layout & UX

**الهدف**: الموقع يحس "مرتّب" أكثر.

- **TopNav محسّن**: blur background عند scroll، إخفاء جزئي عند النزول
- **HeroBanner**: تحسين البحث الرئيسي مع suggestions تظهر فورياً تحت الـinput
- **CategoryCircles**: استبدال بـbento grid mini على الديسكتوب (3×2 بدل circles فقط)
- **ProductRail**: أسهم scroll أوضح + dots indicator + snap scrolling أنعم
- **BottomTabBar (موبايل)**: تأثير "active pill" متحرّك بين التابات
- **SiteFooter**: إعادة ترتيب لـ4 أعمدة منظّمة مع روابط أوضح
- **Empty states**: تصاميم أحلى للنتائج الفارغة (illustration + CTA)

## 🚀 المرحلة 5: Performance & Polish نهائي

- **Image optimization**: تطبيق `loading="lazy"` + `decoding="async"` على كل الصور (جزئي حالياً)
- **Reduced motion**: احترام `prefers-reduced-motion` في كل الأنيميشنات
- **Focus states محسّنة**: ring واضح ومتسق لكل العناصر التفاعلية (keyboard accessibility)
- **Toast notifications محسّنة**: تصميم أنعم مع icons ملوّنة حسب النوع

---

## 📋 الملفات المتأثّرة (تقريباً)

```text
src/index.css              → keyframes + utility classes جديدة (shimmer, lift, glow)
tailwind.config.ts         → animations + shadows جديدة
src/components/ui/skeleton.tsx → shimmer effect
src/components/TopNav.tsx  → blur on scroll + hide on scroll down
src/components/HeroBanner.tsx → search suggestions inline
src/components/ProductCard.tsx → Quick View + Wishlist buttons + hover lift
src/components/UnifiedProductCard.tsx → نفس التحسينات
src/components/ShopCard.tsx → hover preview tooltip
src/components/ProductRail.tsx → scroll arrows + dots + snap
src/components/BottomTabBar.tsx → animated active pill
src/components/SiteFooter.tsx → 4-col layout
src/components/CategoryCircles.tsx → bento variant للديسكتوب
src/components/CommandPalette.tsx → ⌘K binding
src/components/MetricsStrip.tsx → تفعيل CountUp
src/components/CompareBar.tsx → sticky bottom bar محسّن
src/components/EmptyState.tsx → illustrations + CTA
src/hooks/useScrollDirection.ts (جديد) → لـsticky filters و TopNav
src/hooks/useScrollReveal.ts (جديد) → IntersectionObserver wrapper
src/hooks/useRecentlyViewed.ts (جديد) → localStorage
src/hooks/useWishlist.ts (جديد) → localStorage
src/components/QuickViewDialog.tsx (جديد)
src/components/RecentlyViewedStrip.tsx (جديد)
src/pages/Wishlist.tsx (جديد) + route في App.tsx
```

---

## ⏱️ ترتيب التنفيذ المقترح

1. **المرحلة 1 + 2** (Polish + Micro-interactions) — أساس بصري قوي، تأثير فوري
2. **المرحلة 4** (Layout & UX) — ترتيب وتحسين المكوّنات الموجودة
3. **المرحلة 3** (مميزات جديدة) — Quick View, Wishlist, Recently Viewed, ⌘K
4. **المرحلة 5** (Performance & A11y) — لمسات نهائية

ممكن نسوي الكل دفعة واحدة، أو نقسّمها على مراحل ونشوف النتيجة بين كل مرحلة.

