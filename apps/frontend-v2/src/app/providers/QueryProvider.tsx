import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real, deliberate defaults - not the library defaults blindly kept.
 * retry: false on 401/403/404 (real, predictable failures a refetch
 * won't fix) but retries transient network/5xx errors twice.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  const apiError = error as AppApiError;
  if (apiError?.statusCode && [401, 403, 404].includes(apiError.statusCode)) {
    return false;
  }
  return failureCount < 2;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: shouldRetry,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
