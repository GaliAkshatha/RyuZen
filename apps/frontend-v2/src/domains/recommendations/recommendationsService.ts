import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { RecommendationItem } from "@/domains/recommendations/recommendations.types";

/** Confirmed real mount /api/v1/ai/recommendations, open to any authenticated user. */
export const recommendationsService = {
  async get(): Promise<RecommendationItem[]> {
    const res = await apiClient.get<ApiSuccessResponse<{ recommendations: RecommendationItem[] }>>("/ai/recommendations");
    return res.data.data.recommendations;
  },
};
