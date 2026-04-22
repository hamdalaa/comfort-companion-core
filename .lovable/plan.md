

## تحسينات الأداء، الـSkeletons، والـAccessibility

تحسينات تركز على ما طلبته: تقليل layout jank، إضافة skeletons للبحث/الوجهات، التحقق من RTL، keyboard nav للفلاتر، وضبط المسافات على الشاشات الصغيرة.

### النتيجة المتوقعة

```text
┌────────────────────────────────────────────────┐
│ Marquee (GPU-only، يتوقف خارج الشاشة، يحترم  │
│         prefers-reduced-motion)               │
├────────────────────────────────────────────────┤
│ Hero (مسافات أصغر على الموبايل، tap targets   │
│       متوازية ≥44px)                          │
│                                                │
│ [● مباشر · دليل الإلكترونيات →]               │
│  H1 (مسافة أقل أعلى الموبايل)                  │
│  Subheading                                    │
│  ┌──────────────────────────────────────┐     │
│  │ Search [Esc=close, Tab=cycle filters]│     │
│  └──────────────────────────────────────┘     │
│  Trust pills (separators تعمل في RTL)         │
│  Stat row                                      │
│                                                │
│  Destinations (skeleton بنفس الـlayout قبل     │
│                تحميل الصور)                    │
└────────────────────────────────────────────────┘
```

### التحسينات التفصيلية

**1. أداء الأنيميشن والـMarquee**
- `AnnouncementBar`: إضافة `will-change: transform` و `transform: translate3d(0,0,0)` على عنصر الـmarquee لتفعيل GPU compositing.
- إخفاء الـmarquee تلقائياً عبر `IntersectionObserver` عندما يخرج الـAnnouncementBar من viewport (إيقاف `animation-play-state: paused`) — يقلل CPU بشكل ملحوظ على الموبايل عند التمرير.
- إضافة `@media (prefers-reduced-motion: reduce)` صريحة على الـmarquee لإيقافه كاملاً (الموجود حالياً يقلله إلى `0.01ms` فقط — سيء بصرياً للـmarquee).
- `HeroBanner`: إضافة `will-change: opacity, transform` على عناصر `animate-fade-in-up` لتجنب paint repeats، وإزالتها بعد انتهاء الأنيميشن عبر `animation-fill-mode: backwards` الموجود + class تنظف نفسها.
- إزالة الـ`backdrop-blur-xl` من بطاقات stats على الموبايل (`sm:backdrop-blur-md`) — الـbackdrop-filter مكلف جداً على low-end.

**2. Skeletons لنتائج البحث والوجهات**
- إنشاء `src/components/HeroDestinationsSkeleton.tsx`: 3 بطاقات بنفس aspect-ratio (16:10) مع `Skeleton` component موجود (shimmer). يُعرض حتى تُحمّل صور البطاقات.
- `HeroDestinations.tsx`: استخدام `useState` لتتبع `imageLoaded` لكل بطاقة + عرض skeleton overlay داخل كل بطاقة حتى `onLoad`.
- `Results.tsx` (`/search`): إنشاء `SearchResultsSkeleton` يطابق grid البطاقات (6 بطاقات placeholder) ويُعرض أثناء computation الفلاتر/الترتيب الثقيل (نستخدم `useDeferredValue` + skeleton أثناء `isPending`).
- `SearchAutocomplete`: إضافة skeleton rows (3 صفوف) عندما `query.trim()` موجود لكن `suggestions` لم يحسب بعد (`useDeferredValue` فجوة).

**3. التحقق من RTL والـbreakpoints**
- مراجعة الـ`underline SVG` تحت "بمكان واحد" — حالياً `left: 0` ثابت، نغيره إلى `inset-x-0` ليعمل في RTL بشكل صحيح.
- Trust pills separator (`·`): التأكد من استخدام logical spacing (`gap-x-3`) بدلاً من `space-x` لتجنب مشاكل RTL.
- Destinations badges (`absolute right-3 top-3`) → `end-3 top-3` لتعمل تلقائياً مع `dir="rtl"`.
- Stat row dividers: التأكد من `divide-x-reverse` يعمل (موجود) + اختبار على `sm:` و `md:` و `lg:`.
- Marquee edge fades: `from-transparent to-background` مع `start-0`/`end-0` (موجود ✓).

**4. Keyboard navigation للفلاتر**
- `HeroSearch.tsx`: إضافة `tabIndex` صريح على input → category trigger → area trigger → submit button (focus order طبيعي حالياً، لكن نضمنه).
- إضافة `onKeyDown` handler على الفورم: `Escape` يغلق أي select مفتوح + يعيد التركيز للـinput.
- ضمان أن Radix `Select` يستجيب لـ `Escape` (يفعل افتراضياً) — نضيف `onOpenChange` handler يتذكر آخر trigger ركّز عليه.
- إضافة `aria-label` لكل من category و area selects (`اختر الفئة` / `اختر المنطقة`).
- إضافة visible focus ring أوضح على الـtriggers (`focus-visible:ring-2 focus-visible:ring-primary/50`).

**5. مسافات Hero/Search على الشاشات الصغيرة**
- `HeroBanner`: تقليل `pt-14 pb-20` إلى `pt-10 pb-14` على الموبايل (`sm:pt-20 sm:pb-24` يبقى).
- المسافة بين الـheadline والـsubheading: من `mt-7` إلى `mt-5` على الموبايل.
- Stat row: من `mt-14` إلى `mt-10` على الموبايل.
- HeroDestinations: من `mt-16` إلى `mt-10` على الموبايل.
- HeroSearch: ضمان ارتفاع كل tap targets ≥ 44px (حالياً 52px ✓)، وإضافة `min-h-[44px]` على الـSelect triggers كأمان.
- على الشاشات `<sm`: stack الفلاتر عمودياً (موجود ✓) لكن مع `gap-2` بدل `gap-1.5` لتفصل tap targets بصرياً.

### الملفات المتأثرة

- `src/components/AnnouncementBar.tsx` — IntersectionObserver، GPU optimization، reduced-motion
- `src/components/HeroBanner.tsx` — مسافات mobile، RTL underline، backdrop-blur conditional
- `src/components/HeroSearch.tsx` — keyboard nav، Escape handler، aria-labels، tap targets
- `src/components/HeroDestinations.tsx` — image-load skeleton state، RTL positions (end-3)
- `src/components/HeroDestinationsSkeleton.tsx` — **جديد**
- `src/components/SearchAutocomplete.tsx` — pending state skeleton rows
- `src/components/skeletons/PageSkeletons.tsx` — إضافة `SearchResultsSkeleton`
- `src/pages/Results.tsx` — استخدام `useDeferredValue` + skeleton أثناء filter computation
- `src/index.css` — `will-change` utility، marquee reduced-motion override

### مبادئ التطبيق

- **No layout shift**: كل skeleton يطابق الأبعاد النهائية بالضبط
- **GPU-only animations**: `transform` و `opacity` فقط، لا `width`/`height`/`top`
- **Accessibility**: focus visible، Escape يعمل، tap targets ≥ 44px، aria-labels عربية
- **Mobile-first spacing**: تقليل padding على < sm، نفس الإيقاع على ≥ sm

