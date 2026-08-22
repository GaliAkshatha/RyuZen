import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";

import type { AppApiError } from "@/shared/types/api.types";

/**
 * Thin wrapper over useMutation with AppApiError baked in as the real
 * error type - apiClient's response interceptor genuinely normalizes
 * every failure to this shape (confirmed in apiClient.ts), so
 * React Query's default `Error` inference was wrong for every mutation
 * in this app, not just one. Fixing it once here instead of adding
 * explicit generics to every individual hook.
 */
export function useApiMutation<TData, TVariables = void>(
  options: UseMutationOptions<TData, AppApiError, TVariables>,
): UseMutationResult<TData, AppApiError, TVariables> {
  return useMutation(options);
}
