import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { ProfileResponseDto } from "@/features/auth/types/auth.types";
import type { Permission } from "@/types/enums";

/**
 * Confirmed this milestone: Grant/Revoke Permission are SUPER_ADMIN +
 * ORG_ADMIN, mounted at /api/v1/users/:userId/permissions/grant|revoke
 * (not nested under any admin/ path despite navRegistry's "/app/admin/
 * users" label). Both return the target user's full, updated
 * ProfileResponseDto — the exact same shape returned by GET
 * /auth/profile — including their complete `permissions` array, not a
 * lighter confirmation-only response.
 */
export const userPermissionsService = {
  grant(userId: string, permission: Permission): Promise<ProfileResponseDto> {
    return apiClient
      .post<ProfileResponseDto>(`${API_ENDPOINTS.users}/${userId}/permissions/grant`, {
        permission,
      })
      .then((response) => response.data);
  },

  revoke(userId: string, permission: Permission): Promise<ProfileResponseDto> {
    return apiClient
      .post<ProfileResponseDto>(`${API_ENDPOINTS.users}/${userId}/permissions/revoke`, {
        permission,
      })
      .then((response) => response.data);
  },
};
