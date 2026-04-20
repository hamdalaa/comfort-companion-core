import { useEffect, useMemo } from "react";
import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import {
  getBrandDetail,
  getCatalogBootstrap,
  getCityDetail,
  getCities,
  getStoreDetail,
  type BrandDetailResponse,
  type CatalogBootstrap,
  type CityFile,
  type CityIndexEntry,
  type StoreDetailResponse,
} from "./catalogApi";
import { getProduct, getProductOffers, type UnifiedOffer, type UnifiedProduct } from "./unifiedSearch";
import { readPersistedQuery, writePersistedQuery } from "./queryStorage";

const MINUTE = 60_000;

export const PERSIST_TTL = {
  bootstrap: 5 * MINUTE,
  product: 5 * MINUTE,
  productOffers: 5 * MINUTE,
  brand: 15 * MINUTE,
  store: 15 * MINUTE,
  cityList: 30 * MINUTE,
  cityDetail: 30 * MINUTE,
} as const;

export const queryKeys = {
  bootstrap: ["catalog", "bootstrap"] as const,
  brand: (slug: string) => ["catalog", "brand", slug] as const,
  store: (storeId: string) => ["catalog", "store", storeId] as const,
  product: (productId: string) => ["catalog", "product", productId] as const,
  productOffers: (productId: string) => ["catalog", "product-offers", productId] as const,
  cityList: ["catalog", "cities"] as const,
  cityDetail: (slug: string) => ["catalog", "city", slug] as const,
};

interface PersistentQueryConfig<TQueryFnData, TData = TQueryFnData> {
  queryKey: QueryKey;
  ttlMs: number;
  queryFn: NonNullable<UseQueryOptions<TQueryFnData, Error, TData>["queryFn"]>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  select?: UseQueryOptions<TQueryFnData, Error, TData>["select"];
}

function usePersistentQuery<TQueryFnData, TData = TQueryFnData>({
  queryKey,
  ttlMs,
  queryFn,
  enabled = true,
  staleTime = 0,
  gcTime,
  select,
}: PersistentQueryConfig<TQueryFnData, TData>) {
  const initialRecord = useMemo(() => readPersistedQuery<TQueryFnData>(queryKey, ttlMs), [queryKey, ttlMs]);

  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    gcTime,
    select,
    initialData: initialRecord?.data,
    initialDataUpdatedAt: initialRecord?.updatedAt,
  });

  useEffect(() => {
    if (!query.isSuccess) return;
    writePersistedQuery<TQueryFnData>(queryKey, {
      updatedAt: query.dataUpdatedAt || Date.now(),
      data: queryClient.getQueryData(queryKey) as TQueryFnData,
    });
  }, [query.dataUpdatedAt, query.isSuccess, queryKey]);

  return query;
}

async function prefetchPersistentQuery<T>({
  queryKey,
  ttlMs,
  queryFn,
  staleTime = 0,
  gcTime,
}: Omit<PersistentQueryConfig<T>, "enabled" | "select">) {
  const persisted = readPersistedQuery<T>(queryKey, ttlMs);
  if (persisted) {
    queryClient.setQueryData(queryKey, persisted.data, { updatedAt: persisted.updatedAt });
    if (Date.now() - persisted.updatedAt <= staleTime) return;
  }

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
  });
}

export function useCatalogBootstrapQuery() {
  return usePersistentQuery<CatalogBootstrap>({
    queryKey: queryKeys.bootstrap,
    ttlMs: PERSIST_TTL.bootstrap,
    staleTime: 30_000,
    queryFn: () => getCatalogBootstrap(),
  });
}

export function useBrandDetailQuery(slug?: string) {
  return usePersistentQuery<BrandDetailResponse | null>({
    queryKey: queryKeys.brand(slug ?? ""),
    ttlMs: PERSIST_TTL.brand,
    staleTime: 5 * MINUTE,
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) return null;
      return getBrandDetail(slug);
    },
  });
}

export function useStoreDetailQuery(storeId?: string) {
  return usePersistentQuery<StoreDetailResponse | null>({
    queryKey: queryKeys.store(storeId ?? ""),
    ttlMs: PERSIST_TTL.store,
    staleTime: 5 * MINUTE,
    enabled: Boolean(storeId),
    queryFn: async () => {
      if (!storeId) return null;
      return getStoreDetail(storeId);
    },
  });
}

export function useProductDetailQuery(productId?: string) {
  return usePersistentQuery<UnifiedProduct | null>({
    queryKey: queryKeys.product(productId ?? ""),
    ttlMs: PERSIST_TTL.product,
    staleTime: 30_000,
    enabled: Boolean(productId),
    queryFn: async () => {
      if (!productId) return null;
      return getProduct(productId);
    },
  });
}

export function useProductOffersQuery(productId?: string) {
  return usePersistentQuery<UnifiedOffer[]>({
    queryKey: queryKeys.productOffers(productId ?? ""),
    ttlMs: PERSIST_TTL.productOffers,
    staleTime: 30_000,
    enabled: Boolean(productId),
    queryFn: async () => {
      if (!productId) return [];
      return getProductOffers(productId);
    },
  });
}

export function useCityListQuery() {
  return usePersistentQuery<CityIndexEntry[]>({
    queryKey: queryKeys.cityList,
    ttlMs: PERSIST_TTL.cityList,
    staleTime: 30 * MINUTE,
    queryFn: () => getCities(),
  });
}

export function useCityDetailQuery(slug?: string) {
  return usePersistentQuery<CityFile | null>({
    queryKey: queryKeys.cityDetail(slug ?? ""),
    ttlMs: PERSIST_TTL.cityDetail,
    staleTime: 30 * MINUTE,
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) return null;
      return getCityDetail(slug);
    },
  });
}

export function prefetchCatalogBootstrap() {
  return prefetchPersistentQuery<CatalogBootstrap>({
    queryKey: queryKeys.bootstrap,
    ttlMs: PERSIST_TTL.bootstrap,
    staleTime: 30_000,
    queryFn: () => getCatalogBootstrap(),
  });
}

export function prefetchBrandDetail(slug: string) {
  return prefetchPersistentQuery<BrandDetailResponse | null>({
    queryKey: queryKeys.brand(slug),
    ttlMs: PERSIST_TTL.brand,
    staleTime: 5 * MINUTE,
    queryFn: () => getBrandDetail(slug),
  });
}

export function prefetchStoreDetail(storeId: string) {
  return prefetchPersistentQuery<StoreDetailResponse | null>({
    queryKey: queryKeys.store(storeId),
    ttlMs: PERSIST_TTL.store,
    staleTime: 5 * MINUTE,
    queryFn: () => getStoreDetail(storeId),
  });
}

export function prefetchProductDetail(productId: string) {
  return prefetchPersistentQuery<UnifiedProduct | null>({
    queryKey: queryKeys.product(productId),
    ttlMs: PERSIST_TTL.product,
    staleTime: 30_000,
    queryFn: () => getProduct(productId),
  });
}

export function prefetchProductOffers(productId: string) {
  return prefetchPersistentQuery<UnifiedOffer[]>({
    queryKey: queryKeys.productOffers(productId),
    ttlMs: PERSIST_TTL.productOffers,
    staleTime: 30_000,
    queryFn: () => getProductOffers(productId),
  });
}

export function prefetchCityList() {
  return prefetchPersistentQuery<CityIndexEntry[]>({
    queryKey: queryKeys.cityList,
    ttlMs: PERSIST_TTL.cityList,
    staleTime: 30 * MINUTE,
    queryFn: () => getCities(),
  });
}

export function prefetchCityDetail(slug: string) {
  return prefetchPersistentQuery<CityFile | null>({
    queryKey: queryKeys.cityDetail(slug),
    ttlMs: PERSIST_TTL.cityDetail,
    staleTime: 30 * MINUTE,
    queryFn: () => getCityDetail(slug),
  });
}
