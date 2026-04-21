

# مميزات Shopify-modern UX — حزمة شاملة

## السياق
الموقع كتالوج/مقارنة (مو متجر بيع فعلي). راح نضيف **مميزات UX مستوحاة من ثيمات Shopify الحديثة** (النبأ، Dawn، Impulse) بدون تفعيل Shopify فعلياً. كل المميزات الأربع المختارة + لمسات ثيمات حديثة مدمجة.

## ما سنبنيه (8 ميزات جديدة + 3 تحسينات)

### A. حفظ ومعاينة سريعة

**1. Wishlist Drawer — جديد**
- زر القلب الموجود حالياً في `TopNav` يفتح **Sheet جانبي** يعرض كل المنتجات المحفوظة بتصميم كرت كامل + سعر + رابط للمنتج + زر إزالة + CTA "افتح صفحة المنتج".
- فيه عداد رقمي على الأيقونة (badge أحمر) لما يكون فيه عناصر.
- ملف جديد: `src/components/WishlistDrawer.tsx`، يستهلك `useUserPrefs().favorites` (موجود).

**2. Quick View Modal — جديد**
- زر "عين 👁" يطلع على hover فوق `UnifiedProductCard` و`ProductCard` (يمين الكرت).
- يفتح Dialog فيه: صورة كبيرة + عنوان + برند + سعر + أعلى 3 عروض + زرّ "افتح صفحة كاملة" + زر إضافة للمفضلة وللمقارنة — كل شي بدون مغادرة الصفحة.
- ملف جديد: `src/components/QuickViewDialog.tsx`.

**3. Recently Viewed محسّن — تحديث**
- نخلي `RecentlyViewedStrip` يظهر على الموبايل أيضاً (حالياً `lg:block` فقط) مع تصميم strip أفقي قابل للسحب.
- نضيف "اعرض الكل" يفتح drawer مشابه للـ Wishlist.

---

### B. ثقة وتحويل بصفحة المنتج

**4. Sticky Buy Bar — جديد**
- شريط ثابت بأسفل الشاشة (يطلع بعد scroll للـ ProductDetail) فيه: صورة مصغّرة + اسم + أقل سعر + زر "اطلب من المحل" + زر "قارن الأسعار".
- يختفي على الموبايل حتى ما يصير conflict مع `BottomTabBar` (نخليه فوقه).
- ملف جديد: `src/components/product/StickyBuyBar.tsx`.

**5. Trust Badges Strip — جديد**
- 4 شارات أنيقة بصفحة المنتج بعد السعر مباشرة: ضمان الوكيل · توصيل لكل المحافظات · 7 أيام استبدال · دفع آمن عند الاستلام.
- icons + microcopy عربي قصير.
- ملف جديد: `src/components/product/TrustBadges.tsx`.

**6. Reviews & Ratings UI متقدّم — جديد**
- قسم بصفحة المنتج فيه: متوسط النجوم الكبير + توزيع نجوم (5★ 70%, 4★ 20%…) bar chart + فلترة المراجعات (بالنجوم) + sample reviews من Google (موجود في `Shop.reviewsSample`).
- ملف جديد: `src/components/product/ReviewsBlock.tsx`.

---

### C. تصفح وبحث احترافي

**7. Mega Menu بالـ TopNav — جديد**
- استبدال dropdown الفئات الحالي بـ **Mega Menu** عريض (يظهر على hover/focus على ديسكتوب) فيه:
  - عمود يسار: الفئات الرئيسية مع icons
  - عمود وسط: أشهر البراندات لكل فئة
  - عمود يمين: صورة فئة + CTA "تصفح الكل"
- على الموبايل يبقى Sheet الموجود.
- تحديث: `src/components/TopNav.tsx` + ملف جديد `src/components/MegaMenu.tsx`.

**8. Search Suggestions غني — تحديث**
- نطوّر `SearchAutocomplete` ليعرض 3 أعمدة على ديسكتوب: **منتجات** (مع صور صغيرة + سعر) · **براندات** (مع logo) · **فئات/أقسام** (مع icon).
- نضيف "عمليات بحث شائعة" (chips) لما يكون الـ input فاضي + "بحوثاتي السابقة" (من localStorage).

**9. Sort Pills + Active Filters — تحديث**
- بصفحة `Results.tsx` و `UnifiedSearch.tsx`: نضيف شريط pills بأعلى النتائج (الأرخص · الأعلى تقييم · الأحدث · الأكثر مبيعاً) + شريط chips للفلاتر النشطة (بزر ✕ لكل واحد) + count "324 نتيجة".
- تحديث: `src/components/UnifiedSearchFilters.tsx` و pages.

---

### D. Collection / Bundle Pages

**10. Collection Pages — جديد**
- صفحات منسّقة بمسارات مثل `/collections/[slug]`:
  - `/collections/back-to-school` — لابتوبات + طابعات + إكسسوارات مكتب
  - `/collections/gifts-under-100` — منتجات أقل من 100$ معبأة كهدايا
  - `/collections/gaming-essentials` — كل ما يحتاجه gamer
  - `/collections/best-deals` — أعلى نسب الخصم
- كل صفحة: hero banner كبير + وصف + product grid بفلترة مسبقة.
- ملفات جديدة: `src/pages/Collection.tsx` + `src/lib/collections.ts` (تعريفات الـ bundles).
- إضافة rail بالصفحة الرئيسية "تشكيلات مختارة" بعد PromoBanner #2 (4 كروت).

---

### E. لمسات ثيمات Shopify الحديثة (مدمجة في كل ما سبق)

- **Hover effects**: شيل بسيط للصور + crossfade لصورة ثانية لو متوفرة.
- **Color swatches**: لما يكون فيه offers من محلات متعددة، نعرض dots ملونة صغيرة (موحدة بصرياً).
- **Quick badges**: NEW · SALE -X% · HOT (3+ مشاهدات بآخر ساعة) · LOW STOCK.
- **Scroll-triggered animations**: fade-in-up للـ rails (موجود — نوسّعه للـ collections).

---

## ترتيب التنفيذ (مرحلتين)

**المرحلة 1 (هاي اللوب):**
- WishlistDrawer + Quick View Modal + Sticky Buy Bar + Trust Badges + ReviewsBlock + Sort Pills + Active Filters chips.

**المرحلة 2 (لوب ثاني بعد التأكيد):**
- Mega Menu + Search Suggestions الغني + Collection Pages + Bundle rail.

---

## التفاصيل التقنية

| ملف | التغيير |
|---|---|
| `src/components/WishlistDrawer.tsx` | **جديد** — Sheet drawer للمفضلة |
| `src/components/QuickViewDialog.tsx` | **جديد** — Dialog للمعاينة السريعة |
| `src/components/product/StickyBuyBar.tsx` | **جديد** — شريط شراء ثابت |
| `src/components/product/TrustBadges.tsx` | **جديد** — 4 شارات ثقة |
| `src/components/product/ReviewsBlock.tsx` | **جديد** — توزيع نجوم + فلترة |
| `src/components/MegaMenu.tsx` | **جديد** (مرحلة 2) |
| `src/components/SortPillsBar.tsx` | **جديد** — pills للترتيب + active filters |
| `src/pages/Collection.tsx` | **جديد** (مرحلة 2) |
| `src/lib/collections.ts` | **جديد** (مرحلة 2) — تعريف الـ bundles |
| `src/components/UnifiedProductCard.tsx` | **تحديث** — Quick View button + badges (NEW/SALE/HOT) |
| `src/components/ProductCard.tsx` | **تحديث** — نفس الإضافات |
| `src/components/TopNav.tsx` | **تحديث** — badge على القلب + يفتح WishlistDrawer + Mega Menu (م2) |
| `src/components/SearchAutocomplete.tsx` | **تحديث** (م2) — 3 أعمدة + popular queries |
| `src/pages/ProductDetail.tsx` | **تحديث** — يستخدم StickyBuyBar + TrustBadges + ReviewsBlock |
| `src/pages/Results.tsx` + `UnifiedSearch.tsx` | **تحديث** — SortPillsBar + chips |
| `src/App.tsx` | **تحديث** (م2) — route `/collections/:slug` |
| `src/components/RecentlyViewedStrip.tsx` | **تحديث** — يظهر على الموبايل + drawer "اعرض الكل" |

كل المكونات بنفس design system (`primary`, `cyan`, `emerald`, `violet` · `font-display` · `rounded-3xl` · `shadow-soft-*`)، RTL، lazy images، ومتجاوبة.

## ما لن نلمسه
- منطق البيانات/الباكيند (`useDataStore`, queries).
- BottomTabBar.
- نظام theme/ألوان.
- `HeroBanner` أو الإضافات السابقة (announcement, slideshow, category tiles, contact strip).

