import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreateOrganizationPayload,
  CreateOrgAdminPayload,
  CreateOrgAdminResponseDto,
  OrganizationResponseDto,
  UpdateOrganizationPayload,
  UpdateOrganizationStatusPayload,
} from "@/features/organizations/types/organization.types";

export const organizationService = {
  list(): Promise<OrganizationResponseDto[]> {
    return apiClient
      .get<OrganizationResponseDto[]>(API_ENDPOINTS.organizations)
      .then((response) => response.data);
  },

  getById(id: string): Promise<OrganizationResponseDto> {
    return apiClient
      .get<OrganizationResponseDto>(`${API_ENDPOINTS.organizations}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateOrganizationPayload): Promise<OrganizationResponseDto> {
    return apiClient
      .post<OrganizationResponseDto>(API_ENDPOINTS.organizations, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateOrganizationPayload): Promise<OrganizationResponseDto> {
    return apiClient
      .patch<OrganizationResponseDto>(`${API_ENDPOINTS.organizations}/${id}`, payload)
      .then((response) => response.data);
  },

  updateStatus(
    id: string,
    payload: UpdateOrganizationStatusPayload,
  ): Promise<OrganizationResponseDto> {
    return apiClient
      .patch<OrganizationResponseDto>(`${API_ENDPOINTS.organizations}/${id}/status`, payload)
      .then((response) => response.data);
  },

  createOrgAdmin(
    organizationId: string,
    payload: CreateOrgAdminPayload,
  ): Promise<CreateOrgAdminResponseDto> {
    return apiClient
      .post<CreateOrgAdminResponseDto>(
        `${API_ENDPOINTS.organizations}/${organizationId}/admin`,
        payload,
      )
      .then((response) => response.data);
  },
};
