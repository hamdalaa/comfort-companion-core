// Brand background registry — premium showroom imagery per brand.
// Used as priority background on /brands and /brand/:slug.
import apple from "@/assets/brands/bg-apple.jpg";
import samsung from "@/assets/brands/bg-samsung.jpg";
import asus from "@/assets/brands/bg-asus.jpg";
import honor from "@/assets/brands/bg-honor.jpg";
import anker from "@/assets/brands/bg-anker.jpg";

export const BRAND_BACKGROUNDS: Record<string, string> = {
  apple,
  samsung,
  asus,
  honor,
  anker,
};

export function getBrandBackground(slug: string): string | undefined {
  return BRAND_BACKGROUNDS[slug.toLowerCase()];
}
