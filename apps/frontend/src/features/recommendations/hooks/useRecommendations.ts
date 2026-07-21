import { useApiQuery } from "@/hooks/useApiQuery";

import { recommendationsService } from "@/features/recommendations/services/recommendations.service";

export const RECOMMENDATIONS_QUERY_KEY = ["recommendations"] as const;

export function useRecommendations() {
  return useApiQuery({
    queryKey: RECOMMENDATIONS_QUERY_KEY,
    queryFn: recommendationsService.get,
  });
}
