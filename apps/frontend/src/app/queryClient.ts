import { QueryClient } from "@tanstack/react-query";

import type { AppApiError } from "@/types/api";

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
