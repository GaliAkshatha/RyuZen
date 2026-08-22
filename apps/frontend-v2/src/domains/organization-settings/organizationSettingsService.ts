import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  OrganizationSettings,
  UpdateOrganizationSettingsRequest,
} from "@/domains/organization-settings/organizationSettings.types";

/** Confirmed real, mounted at /api/v1/organizations/settings, ORG_ADMIN-only for both GET and PATCH. */
export const organizationSettingsService = {
  async get(): Promise<OrganizationSettings> {
    const res = await apiClient.get<ApiSuccessResponse<OrganizationSettings>>("/organizations/settings");
    return res.data.data;
  },
  async update(payload: UpdateOrganizationSettingsRequest): Promise<OrganizationSettings> {
    const res = await apiClient.patch<ApiSuccessResponse<OrganizationSettings>>("/organizations/settings", payload);
    return res.data.data;
  },
};
