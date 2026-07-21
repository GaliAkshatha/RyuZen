import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AuthResponseDto,
  ForgotPasswordPayload,
  ForgotPasswordResponseDto,
  LoginCredentials,
  ProfileResponseDto,
  RefreshTokenPayload,
  RegisterPayload,
  RegisterUserResponseDto,
  ResetPasswordPayload,
} from "@/features/auth/types/auth.types";

/**
 * F4 built login/refresh/getProfile. P1 (this milestone) extends this
 * same file with register/forgotPassword/resetPassword, per the
 * roadmap's own note that P1 "extends" auth.service.ts rather than
 * re-creating it.
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

  register(payload: RegisterPayload): Promise<RegisterUserResponseDto> {
    return apiClient
      .post<RegisterUserResponseDto>(`${API_ENDPOINTS.auth}/register`, payload)
      .then((response) => response.data);
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponseDto> {
    return apiClient
      .post<ForgotPasswordResponseDto>(`${API_ENDPOINTS.auth}/forgot-password`, payload)
      .then((response) => response.data);
  },

  resetPassword(payload: ResetPasswordPayload): Promise<null> {
    return apiClient
      .post<null>(`${API_ENDPOINTS.auth}/reset-password`, payload)
      .then((response) => response.data);
  },
};
