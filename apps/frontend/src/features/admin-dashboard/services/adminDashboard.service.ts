import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { DashboardResponseDto } from "@/features/admin-dashboard/types/adminDashboard.types";

export const adminDashboardService = {
  get(): Promise<DashboardResponseDto> {
    return apiClient
      .get<DashboardResponseDto>(API_ENDPOINTS.dashboard)
      .then((response) => response.data);
  },
};
