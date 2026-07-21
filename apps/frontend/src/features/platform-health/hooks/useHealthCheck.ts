import { useApiQuery } from "@/hooks/useApiQuery";

import { healthService } from "@/features/platform-health/services/health.service";

export function useHealthCheck() {
  return useApiQuery({
    queryKey: ["platform-health"] as const,
    queryFn: healthService.check,
    // Health check failures are represented as { reachable: false }, not thrown — no need to retry indefinitely.
    retry: false,
  });
}
