import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AuthResponseDto,
  ForgotPasswordPayload,
  ForgotPasswordResponseDto,
  LoginCredentials,
  ProfileResponseDto,
  RefreshTokenPayload,
  ResetPasswordPayload,
  VerifyInvitationPayload,
  VerifyInvitationResponseDto,
  AcceptInvitationPayload,
  SessionResponseDto,
} from "@/features/auth/types/auth.types";

/**
 * F4 built login/refresh/getProfile. P1 extended this same file with
 * forgotPassword/resetPassword. Public self-service registration was
 * removed once the Invitation System replaced it — accounts are now
 * created by an ORG_ADMIN (see features/invitations), never
 * self-registered.
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

  verifyInvitation(payload: VerifyInvitationPayload): Promise<VerifyInvitationResponseDto> {
    return apiClient
      .post<VerifyInvitationResponseDto>(`${API_ENDPOINTS.auth}/verify-invitation`, payload)
      .then((response) => response.data);
  },

  acceptInvitation(payload: AcceptInvitationPayload): Promise<null> {
    return apiClient
      .post<null>(`${API_ENDPOINTS.auth}/accept-invitation`, payload)
      .then((response) => response.data);
  },

  logout(): Promise<null> {
    return apiClient
      .post<null>(`${API_ENDPOINTS.auth}/logout`, {})
      .then((response) => response.data);
  },

  logoutAllDevices(): Promise<null> {
    return apiClient
      .post<null>(`${API_ENDPOINTS.auth}/logout-all`, {})
      .then((response) => response.data);
  },

  getSessions(): Promise<SessionResponseDto[]> {
    return apiClient
      .get<SessionResponseDto[]>(`${API_ENDPOINTS.auth}/sessions`)
      .then((response) => response.data);
  },

  revokeSession(id: string): Promise<null> {
    return apiClient
      .post<null>(`${API_ENDPOINTS.auth}/sessions/${id}/revoke`, {})
      .then((response) => response.data);
  },
};
