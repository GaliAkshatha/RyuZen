import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { OrgDashboard } from "@/domains/org-dashboard/orgDashboard.types";

/** Confirmed SUPER_ADMIN/ORG_ADMIN, scoped to the caller's own organizationId. */
export const orgDashboardService = {
  async get(): Promise<OrgDashboard> {
    const res = await apiClient.get<ApiSuccessResponse<OrgDashboard>>("/dashboard");
    return res.data.data;
  },
};
