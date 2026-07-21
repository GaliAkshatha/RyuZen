import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import type { AppApiError } from "@/types/api";
import { toast } from "@/hooks/useToast";

/**
 * Centralized 500/network-error toast (H2). Deliberately narrow: a
 * routine 404/403/validation error is already handled inline by the
 * failing page's own ErrorState or form error summary — surfacing
 * those a second time as a toast would be noisy and redundant. A
 * genuine 5xx or network failure is different: it's unexpected enough,
 * and can originate from a background refetch the person isn't
 * looking at, that a toast is the right way to make sure it's noticed
 * regardless of which component triggered it. 401 is excluded — that
 * path is entirely owned by the auth refresh flow (F3/F4) and
 * ProtectedRoute's declarative redirect, not this handler.
 */
export function notifyOnUnexpectedError(error: unknown): void {
  const apiError = error as AppApiError;

  if (apiError?.isServerError || apiError?.isNetworkError) {
    toast({
      title: apiError.isNetworkError ? "Connection problem" : "Server error",
      description: apiError.message,
      variant: "destructive",
    });
  }
}

/**
 * Central TanStack Query client.
 *
 * Retry policy notes:
 * - The backend applies rate limiting (see backend milestone: Rate Limiting).
 *   A 429 response should not be retried aggressively; we back off instead
 *   of hammering an already-limited endpoint.
 * - 401s are handled by the auth refresh flow in the API client (F4), not
 *   by query retries, so they are excluded here too.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notifyOnUnexpectedError }),
  mutationCache: new MutationCache({ onError: notifyOnUnexpectedError }),
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const apiError = error as AppApiError;

        if (
          apiError.isUnauthorized ||
          apiError.isForbidden ||
          apiError.isNotFound ||
          apiError.isRateLimited
        ) {
          return false;
        }

        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
