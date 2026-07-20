import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AuthResponseDto,
  LoginCredentials,
  ProfileResponseDto,
  RefreshTokenPayload,
} from "@/features/auth/types/auth.types";

/**
 * F4 builds only the methods AuthContext itself needs (login, refresh,
 * getProfile). P1 (Auth Pages) extends this same file with register,
 * forgotPassword, and resetPassword — this file is not re-created there,
 * only appended to.
 */
export const authService = {
  login(credentials: LoginCredentials): Promise<AuthResponseDto> {
    return apiClient
      .post<AuthResponseDto>(`${API_ENDPOINTS.auth}/login`, credentials)
      .then((response) => response.data);
  },

  refresh(payload: RefreshTokenPayload): Promise<AuthResponseDto> {
    return apiClient
      .post<AuthResponseDto>(`${API_ENDPOINTS.auth}/refresh`, payload)
      .then((response) => response.data);
  },

  getProfile(): Promise<ProfileResponseDto> {
    return apiClient
      .get<ProfileResponseDto>(`${API_ENDPOINTS.auth}/profile`)
      .then((response) => response.data);
  },
};
