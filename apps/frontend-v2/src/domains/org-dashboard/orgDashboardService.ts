import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { OrgDashboard } from "@/domains/org-dashboard/orgDashboard.types";

/** Confirmed SUPER_ADMIN/ORG_ADMIN, scoped to the caller's own organizationId - for Super Admin this reflects whatever organization their account is associated with, not a true cross-platform aggregate (no such endpoint exists; Organizations list is the closest thing to platform-wide oversight). */
export const orgDashboardService = {
  async get(): Promise<OrgDashboard> {
    const res = await apiClient.get<ApiSuccessResponse<OrgDashboard>>("/dashboard");
    return res.data.data;
  },
};
