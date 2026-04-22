

## تحسينات إضافية على الواجهة — صقل وإحكام

سأكمل تنقيح الواجهة بتحسينات دقيقة تركز على التفاصيل التي تفصل بين تصميم "جيد" وتصميم "متقن" — خصوصاً في المسافات، والميكرو-تفاعلات، والاتساق البصري بين المكونات.

### النتيجة المتوقعة

```text
┌──────────────────────────────────────────────────────────┐
│  Announcement (أهدأ، أقصر، fade من الجوانب أوضح)        │
├──────────────────────────────────────────────────────────┤
│  TopNav (sticky، blur أقوى عند scroll)                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│         [● مباشر | دليل الإلكترونيات في العراق →]        │
│                                                          │
│            كل محلات الإلكترونيات                          │
│             بمكان واحد.  ← gradient أهدأ + كبر مضبوط     │
│                                                          │
│      نص فرعي بسطرين بمسافات أنفس وtracking أحكم          │
│                                                          │
│    ┌────────────────────────────────────────────────┐    │
│    │ 🔍 ابحث...    │ الفئة │ المنطقة │ [ابحث →]    │    │
│    └────────────────────────────────────────────────┘    │
│                                                          │
│      🛡 موثوق   ·   💲 أفضل سعر   ·   ✨ يومي           │
│                                                          │
│   ┌──────────┬──────────┬──────────┐                    │
│   │ 149K+    │  1,200+  │   10     │  ← stat row محسّن  │
│   │ منتج     │ محل      │ محافظات   │     hover ألطف    │
│   └──────────┴──────────┴──────────┘                    │
│                                                          │
│   ┌────────┐  ┌────────┐  ┌────────┐                   │
│   │ Iraq   │  │ Sinaa  │  │ Rubaie │  ← destinations  │
│   │ 16:10  │  │ صور    │  │ بطاقات │     مع badge      │
│   └────────┘  └────────┘  └────────┘     "جديد" خفيف   │
└──────────────────────────────────────────────────────────┘
```

### التحسينات

**1. Hero — صقل التفاصيل**
- تخفيف حجم العنوان قليلاً على الموبايل (`clamp(2.1rem,5vw,4rem)`) لتجنّب الازدحام في الشاشات الصغيرة
- إضافة highlight underline ناعم تحت كلمة "بمكان واحد" بدل/إضافة على gradient — خط متموج رفيع
- زيادة `max-w-xl` للنص الفرعي إلى `max-w-[34rem]` ليكون أنفس
- Trust pills: إضافة dot separator `·` بدل المسافات لتحسين الإيقاع البصري
- تحسين الـ status chip: تكبير hit area قليلاً، وتوضيح الـ hover state

**2. HeroSearch — تفاعلات أحكم**
- إضافة keyboard shortcut hint (`⌘K`) كـ kbd صغير داخل input عند عدم التركيز
- تحسين الـ focus state: حلقة بلون primary بـ `ring-2` بدل `ring-4` (أنظف)
- زر CTA: تخفيف الـ translate-y عند hover من `-0.5` إلى `-px` (أكثر دقة)
- توحيد ارتفاع كل العناصر داخل الفورم على `h-[52px]` بدل `54/12`
- إضافة `transition-all` ناعم على الـ select triggers

**3. Stat Row — حياة أكثر**
- إضافة hover state على كل stat: خلفية ناعمة `hover:bg-card/60` تنتقل بـ 300ms
- الأيقونة تكبر قليلاً وتدور 3deg عند hover (موجود scale، نضيف rotate خفيف)
- إضافة separator صغير بين الرقم والـ label (نقطة دقيقة)
- Counter: tabular-nums للتأكد من ثبات العرض

**4. HeroDestinations — تفاصيل premium**
- إضافة badge "جديد" أو counter صغير على بطاقة العراق (10 محافظات بشكل مرئي)
- تحسين الـ overlay gradient ليكون أهدأ (`from-foreground/75` بدل `/85`)
- Footer البطاقة: إضافة icon صغير قبل الرقم التسلسلي
- Hover: shadow أقل عمقاً وأكثر انتشاراً (`-12` بدل `-16`)

**5. AnnouncementBar — تنقية**
- إضافة icon ثابت في البداية (Sparkles صغير) كـ anchor بصري قبل الـ marquee
- تخفيف animation duration إلى `60s` (أبطأ = أهدأ)
- توسيع edge fade من `w-12` إلى `w-16`
- زر الإغلاق: نقله لـ `end-2` كـ floating element بدل أن يأخذ مساحة

**6. تحسينات شاملة (cross-cutting)**
- توحيد `font-numeric` و`tabular-nums` على كل الأرقام في الهيرو
- التأكد من تطابق border-radius (كل العناصر في الهيرو على `rounded-2xl` أو `rounded-xl`)
- تحسين `animate-fade-in-up` delays لتكون متناغمة (kicker → headline → sub → search → trust → stats → destinations بفروقات 80ms ثابتة)

### الملفات المتأثرة

- `src/components/HeroBanner.tsx` — صقل التايبوغرافي، stat row hover، trust pills
- `src/components/HeroSearch.tsx` — kbd hint، focus state، توحيد الارتفاعات
- `src/components/HeroDestinations.tsx` — badges، gradient overlay، hover refinement
- `src/components/AnnouncementBar.tsx` — anchor icon، edge fades، إغلاق floating

### مبادئ التصميم المُطبَّقة

- **8pt grid**: كل المسافات مضاعفات من 4/8
- **Visual rhythm**: animation delays ثابتة 80ms
- **Reduced motion**: كل التحولات تحت 300ms
- **No new dependencies**: فقط Tailwind + lucide-react الموجودة

