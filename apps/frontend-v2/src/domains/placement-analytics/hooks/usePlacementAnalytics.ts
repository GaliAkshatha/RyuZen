import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { placementAnalyticsService } from "@/domains/placement-analytics/placementAnalyticsService";
import type { PlacementAnalytics } from "@/domains/placement-analytics/placementAnalytics.types";

export function usePlacementAnalytics() {
  return useApiQuery<PlacementAnalytics>({
    queryKey: ["placement-analytics"] as const,
    queryFn: placementAnalyticsService.get,
  });
}
