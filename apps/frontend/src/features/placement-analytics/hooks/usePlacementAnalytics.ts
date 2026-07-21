import { useApiQuery } from "@/hooks/useApiQuery";

import { placementAnalyticsService } from "@/features/placement-analytics/services/placementAnalytics.service";

export const PLACEMENT_ANALYTICS_QUERY_KEY = ["placement-analytics"] as const;

export function usePlacementAnalytics() {
  return useApiQuery({
    queryKey: PLACEMENT_ANALYTICS_QUERY_KEY,
    queryFn: placementAnalyticsService.get,
  });
}
