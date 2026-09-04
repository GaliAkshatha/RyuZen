import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { ProfileResponse } from "@/domains/auth/auth.types";
import type { UpdateUserStatusRequest, PermissionRequest } from "@/domains/user-admin/userAdmin.types";

/**
 * Real gap filled: all four of these routes existed on the backend
 * (confirmed directly - GrantPermissionUseCase/RevokePermissionUseCase/
 * unlock/status all real, all already tested) with zero frontend
 * caller anywhere in the app. Every method returns a real
 * ProfileResponseDto - the exact same shape /auth/me already returns,
 * reused here rather than inventing a separate type.
 */
export const userAdminService = {
  async grantPermission(userId: string, payload: PermissionRequest): Promise<ProfileResponse> {
    const res = await apiClient.post<ApiSuccessResponse<ProfileResponse>>(`/users/${userId}/permissions/grant`, payload);
    return res.data.data;
  },

  async revokePermission(userId: string, payload: PermissionRequest): Promise<ProfileResponse> {
    const res = await apiClient.post<ApiSuccessResponse<ProfileResponse>>(`/users/${userId}/permissions/revoke`, payload);
    return res.data.data;
  },

  async unlockUser(userId: string): Promise<ProfileResponse> {
    const res = await apiClient.post<ApiSuccessResponse<ProfileResponse>>(`/users/${userId}/unlock`);
    return res.data.data;
  },

  async updateStatus(userId: string, payload: UpdateUserStatusRequest): Promise<ProfileResponse> {
    const res = await apiClient.patch<ApiSuccessResponse<ProfileResponse>>(`/users/${userId}/status`, payload);
    return res.data.data;
  },
};
