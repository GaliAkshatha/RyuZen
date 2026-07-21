import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  OrganizationSettingsResponseDto,
  UpdateOrganizationSettingsPayload,
} from "@/features/organization-settings/types/organizationSettings.types";

export const organizationSettingsService = {
  get(): Promise<OrganizationSettingsResponseDto> {
    return apiClient
      .get<OrganizationSettingsResponseDto>(API_ENDPOINTS.organizationSettings)
      .then((response) => response.data);
  },

  update(payload: UpdateOrganizationSettingsPayload): Promise<OrganizationSettingsResponseDto> {
    return apiClient
      .patch<OrganizationSettingsResponseDto>(API_ENDPOINTS.organizationSettings, payload)
      .then((response) => response.data);
  },
};
