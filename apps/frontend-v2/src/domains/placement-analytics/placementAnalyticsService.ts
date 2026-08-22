import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { PlacementAnalytics } from "@/domains/placement-analytics/placementAnalytics.types";

/** Confirmed ORG_ADMIN/PLACEMENT_ADMIN only, genuinely mounted correctly at /api/v1/placement-analytics. */
export const placementAnalyticsService = {
  async get(): Promise<PlacementAnalytics> {
    const res = await apiClient.get<ApiSuccessResponse<PlacementAnalytics>>("/placement-analytics");
    return res.data.data;
  },
};
