

# إعادة بناء واجهة الموقع — Clean • Premium • Apple-inspired UX

## الهدف
إعادة تصميم كامل للواجهة (UI/UX فقط) بأسلوب Apple — هادئ، فخم، منظّم، ومرتّب — مع **عدم المساس بأي منطق باكند، API، repositories، routes، أو data layer**.

---

## مبادئ التصميم الجديد

1. **Whitespace أولاً** — مسافات سخية، لا ازدحام، تنفّس بين العناصر.
2. **Typography كبطل بصري** — هرمية واضحة جداً (تباين أحجام كبير بين العناوين والنص).
3. **لون محدود ومنضبط** — خلفية ناعمة (off-white)، حبر داكن، لون تمييز واحد فقط (Brass/Amber دافئ)، رمادي للنصوص الثانوية.
4. **Glass + Soft Shadows** — بطاقات بظلال ناعمة جداً، بدون حدود قوية، blur خفيف عند الـ overlays.
5. **حركات Apple-like** — easing هادئ (`cubic-bezier(0.32, 0.72, 0, 1)`)، مدد 300–500ms، fade + subtle scale، لا bounces مزعجة.
6. **صور كبطل** — منتجات/محلات بصور كبيرة، نسب ثابتة، object-cover، corners ناعمة (rounded-2xl/3xl).
7. **RTL محكم** — كل alignment ومسافات مراجعة للعربي.
8. **موبايل أولاً** — كل breakpoint مدروس بعناية.

---

## نظام التصميم (Design Tokens)

تحديث `src/index.css` و `tailwind.config.ts`:

| Token | القيمة |
|---|---|
| `--background` | `#FAFAF7` (paper warm white) |
| `--foreground` | `#0A0A0A` (deep ink) |
| `--muted` | `#F2F2EE` |
| `--muted-foreground` | `#6B6B66` |
| `--border` | `rgba(10,10,10,0.08)` |
| `--accent` | `#B8763E` (warm brass) |
| `--card` | `#FFFFFF` |
| Radius scale | 12 / 20 / 28 px |
| Shadow scale | `0 1px 2px rgba(0,0,0,.04)`, `0 8px 24px rgba(0,0,0,.06)`, `0 24px 64px rgba(0,0,0,.08)` |
| Font display | SF Pro Display (system) → fallback Inter |
| Font Arabic | IBM Plex Arabic / Noto Kufi Arabic |
| Easing | `cubic-bezier(0.32, 0.72, 0, 1)` |

---

## المراحل (Phases)

### Phase 1 — Foundation (نظام التصميم)
- إعادة كتابة `src/index.css`: tokens, base typography, scrollbar, selection, focus rings
- تحديث `tailwind.config.ts`: shadows, radii, fonts, easings, animations
- تحديث `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx` بالأسلوب الجديد (Apple-style: minimal borders, soft shadows, refined hover states)

### Phase 2 — Navigation & Chrome
- إعادة بناء `TopNav.tsx`: شريط رفيع، شفاف مع blur عند scroll، شعار يسار، روابط مركزية، بحث + أيقونات يمين
- إعادة بناء `BottomTabBar.tsx` (موبايل): glass-morphism floating bar
- تحديث `SiteFooter.tsx`: minimal، 3 أعمدة، نص رمادي ناعم
- `BreadcrumbBar` جديد بسيط

### Phase 3 — Home (`Index.tsx` + الأقسام)
- **HeroBanner / HeroSearch** جديد: عنوان ضخم (60–80px display)، sub-copy مهدّب، حقل بحث كبير وسطي بـ glass
- **CategoryCircles / CategoryGrid**: بطاقات أكبر، صور تملأ، تسميات تحت
- **ProductRail / ShopCarousel**: scroll أفقي ناعم، بطاقات بمسافات أكبر
- **MetricsStrip**: أرقام كبيرة مع labels صغيرة (Apple keynote style)
- **HowItWorks**: 3 خطوات بأيقونات outline ناعمة
- **BrandShowcase**: شبكة شعارات على خلفية بيضاء نقية

### Phase 4 — بطاقات المنتج والمحل
- `ProductCard.tsx` و `UnifiedProductCard.tsx`: تصميم جديد — صورة مربعة كبيرة، عنوان أسفلها، سعر بارز، actions تظهر بـ hover ناعم، badge أفضل سعر minimal
- `ShopCard.tsx` / `CityShopCard.tsx` / `ShopResultCard.tsx`: layout مرتّب، صورة + اسم + verification + rating + مسافة، CTA واحد واضح
- `PriceBlock.tsx`: tabular numerals، تباين قوي للسعر الحالي، شطب ناعم للأصلي
- `StarRating.tsx`: نجوم أنحف وألطف

### Phase 5 — صفحات الـ Listing
- `Results.tsx` / `UnifiedSearch.tsx`: sidebar فلاتر يمين (RTL)، grid منتجات، sticky toolbar، empty state أنيق
- `Brands.tsx` / `Brand.tsx`: hero للبراند، grid وكلاء
- `IraqCities.tsx` / `CityPage.tsx`: hero للمدينة، أقسام محلات
- `StreetPage.tsx`: تصميم محرر-magazine
- `UnifiedSearchFilters.tsx` / `ShopFilters.tsx` / `QuickFilterPills.tsx`: pills نظيفة، حالات active واضحة

### Phase 6 — صفحات التفاصيل
- `ProductDetail.tsx`: gallery يسار/أعلى، تفاصيل يمين، sticky CTA، sections منظّمة
- `ShopView.tsx` / `CityShopView.tsx`: hero بصورة المحل، tabs (منتجات/تقييمات/معلومات)، بطاقات مراجعات، خريطة مدمجة
- `About.tsx` / `Dashboard.tsx`: editorial layout

### Phase 7 — Overlays & Micro-interactions
- `CommandPalette.tsx`: Spotlight-style، blur backdrop قوي، قائمة نتائج أنيقة
- `LightboxViewer.tsx`: full-screen أسود مع تحكم minimal
- `CompareBar.tsx`: floating bar بـ glass
- `WelcomeTour.tsx`: cards منعشة
- Skeletons: shimmer ناعم بدل النبض الحاد
- Toast/Sonner: تحديث الأسلوب
- Page transitions: fade + 4px translate

---

## ما لن يتغيّر (مضمون)

- ❌ مجلد `backend/` بالكامل
- ❌ `src/lib/api.ts`, `catalogApi.ts`, `catalogQueries.ts`, `dataStore.tsx`, `shopsRepository.ts`, `unifiedSearch.ts`, `search.ts`, `routeLoaders.ts`, `routePrefetch.ts`
- ❌ `src/lib/types.ts` (شكل البيانات)
- ❌ `src/App.tsx` routes (المسارات نفسها)
- ❌ React Query keys / fetching logic
- ❌ Service worker و caching
- ❌ Tests الموجودة

التغيير حصراً في: components UI، pages markup/layout، CSS/Tailwind tokens، animations.

---

## ملاحظة مهمّة
يوجد حالياً **20 خطأ TypeScript** بالبناء (مذكورة سابقاً). هذي الأخطاء غير متعلّقة بإعادة التصميم لكن لازم نصلّحها بنفس المرحلة الأولى حتى المشروع يكمبايل ويعرض التصميم الجديد. سأصلّحها كأول خطوة في Phase 1 (إصلاحات سطحية: imports ناقصة، types، lib references).

---

## التنفيذ
سأنفّذ المراحل بالترتيب أعلاه على دفعات. كل phase = دفعة تعديلات. بعد كل phase تقدر تختبر وتعطي ملاحظات قبل ما أكمل للي بعدها.

**نقطة البداية بعد الموافقة:** Phase 1 (Foundation + إصلاح أخطاء البناء).

