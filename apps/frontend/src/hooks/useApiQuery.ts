import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";

import type { AppApiError } from "@/types/api";

/**
 * Thin convenience wrapper over TanStack Query's `useQuery`.
 *
 * The only thing this adds is presetting `TError` to `AppApiError` (see
 * types/api.ts) so every query in the app gets a correctly-typed `error`
 * without every feature hook re-specifying the generic by hand. All
 * other TanStack Query behavior — caching, retries, staleTime — is
 * untouched; this is not a replacement for useQuery, just a typed alias.
 */
export function useApiQuery<TData, TQueryKey extends readonly unknown[] = readonly unknown[]>(
  options: UseQueryOptions<TData, AppApiError, TData, TQueryKey>,
): UseQueryResult<TData, AppApiError> {
  return useQuery(options);
}
