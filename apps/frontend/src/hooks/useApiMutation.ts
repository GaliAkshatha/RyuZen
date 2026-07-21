import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

import type { AppApiError } from "@/types/api";

/**
 * Thin convenience wrapper over TanStack Query's `useMutation`, mirroring
 * useApiQuery — presets `TError` to `AppApiError` so mutation error
 * handlers (e.g. reading `error.isValidationError` or
 * `error.errors?.fieldErrors`) are typed everywhere without repetition.
 */
export function useApiMutation<TData, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, AppApiError, TVariables, TContext>,
): UseMutationResult<TData, AppApiError, TVariables, TContext> {
  return useMutation(options);
}
