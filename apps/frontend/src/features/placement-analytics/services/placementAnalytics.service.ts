import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { PlacementAnalyticsResponseDto } from "@/features/placement-analytics/types/placementAnalytics.types";

export const placementAnalyticsService = {
  get(): Promise<PlacementAnalyticsResponseDto> {
    return apiClient
      .get<PlacementAnalyticsResponseDto>(API_ENDPOINTS.placementAnalytics)
      .then((response) => response.data);
  },
};
