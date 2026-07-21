import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { RecommendationsResponseDto } from "@/features/recommendations/types/recommendations.types";

export const recommendationsService = {
  get(): Promise<RecommendationsResponseDto> {
    return apiClient
      .get<RecommendationsResponseDto>(API_ENDPOINTS.aiRecommendations)
      .then((response) => response.data);
  },
};
