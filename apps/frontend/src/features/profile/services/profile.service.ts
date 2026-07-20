import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { ProfileResponseDto } from "@/features/auth/types/auth.types";
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/features/profile/types/profile.types";

/**
 * GET /auth/profile is deliberately NOT duplicated here — it's the
 * exact same endpoint authService.getProfile (F4) already calls, reused
 * via useProfile (see hooks/useProfile.ts) rather than re-implemented.
 */
export const profileService = {
  updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponseDto> {
    return apiClient
      .patch<ProfileResponseDto>(`${API_ENDPOINTS.auth}/profile`, payload)
      .then((response) => response.data);
  },

  changePassword(payload: ChangePasswordPayload): Promise<null> {
    return apiClient
      .patch<null>(`${API_ENDPOINTS.auth}/change-password`, payload)
      .then((response) => response.data);
  },
};
