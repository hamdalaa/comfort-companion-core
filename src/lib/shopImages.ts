import { loadCity, type CityShop } from "@/lib/cityData";
import type { Shop } from "@/lib/types";

const shopImageCache = new Map<string, string>();
const cityImageLoadCache = new Map<string, Promise<void>>();

function isUsableImage(url?: string | null): url is string {
  return Boolean(url && url !== "Not found");
}

function firstCityShopImage(shop: CityShop): string | undefined {
  const candidates = [...(shop.gallery ?? []), shop.imageUrl].filter(isUsableImage);
  return candidates[0];
}

function cacheCityShopImage(shop: CityShop, imageUrl: string) {
  shopImageCache.set(shop.id, imageUrl);
  if (shop.place_id) shopImageCache.set(shop.place_id, imageUrl);
  if (shop.googleMapsUrl) shopImageCache.set(shop.googleMapsUrl, imageUrl);
}

async function preloadCityImages(citySlug: string) {
  if (!cityImageLoadCache.has(citySlug)) {
    cityImageLoadCache.set(
      citySlug,
      (async () => {
        const city = await loadCity(citySlug);
        if (!city) return;
        city.stores.forEach((store) => {
          const imageUrl = firstCityShopImage(store);
          if (imageUrl) cacheCityShopImage(store, imageUrl);
        });
      })(),
    );
  }

  await cityImageLoadCache.get(citySlug);
}

export async function preloadShopImages(shops: Array<Pick<Shop, "citySlug">>) {
  const citySlugs = [...new Set(shops.map((shop) => shop.citySlug).filter(Boolean) as string[])];
  await Promise.all(citySlugs.map((slug) => preloadCityImages(slug)));
}

export function getShopImage(shop: Pick<Shop, "id" | "seedKey" | "googleMapsUrl" | "imageUrl" | "gallery">) {
  const directCandidates = [...(shop.gallery ?? []), shop.imageUrl].filter(isUsableImage);
  return (
    directCandidates[0] ??
    shopImageCache.get(shop.seedKey) ??
    shopImageCache.get(shop.id) ??
    (shop.googleMapsUrl ? shopImageCache.get(shop.googleMapsUrl) : undefined)
  );
}
