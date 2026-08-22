import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { recommendationsService } from "@/domains/recommendations/recommendationsService";
import type { RecommendationItem } from "@/domains/recommendations/recommendations.types";

export function useRecommendations() {
  return useApiQuery<RecommendationItem[]>({
    queryKey: ["ai", "recommendations"] as const,
    queryFn: recommendationsService.get,
  });
}
