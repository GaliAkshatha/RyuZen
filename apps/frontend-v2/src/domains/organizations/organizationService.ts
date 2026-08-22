import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationStatusRequest,
  CreateOrgAdminRequest,
  CreateOrgAdminResponse,
} from "@/domains/organizations/organization.types";

/** Every call maps 1:1 to a real, confirmed SUPER_ADMIN-only route (organization.routes.ts). */
export const organizationService = {
  async list(): Promise<Organization[]> {
    const res = await apiClient.get<ApiSuccessResponse<Organization[]>>("/organizations");
    return res.data.data;
  },

  async getById(id: string): Promise<Organization> {
    const res = await apiClient.get<ApiSuccessResponse<Organization>>(`/organizations/${id}`);
    return res.data.data;
  },

  async create(payload: CreateOrganizationRequest): Promise<Organization> {
    const res = await apiClient.post<ApiSuccessResponse<Organization>>("/organizations", payload);
    return res.data.data;
  },

  async updateStatus(id: string, payload: UpdateOrganizationStatusRequest): Promise<Organization> {
    const res = await apiClient.patch<ApiSuccessResponse<Organization>>(`/organizations/${id}/status`, payload);
    return res.data.data;
  },

  async createOrgAdmin(organizationId: string, payload: CreateOrgAdminRequest): Promise<CreateOrgAdminResponse> {
    const res = await apiClient.post<ApiSuccessResponse<CreateOrgAdminResponse>>(
      `/organizations/${organizationId}/admin`,
      payload,
    );
    return res.data.data;
  },
};
