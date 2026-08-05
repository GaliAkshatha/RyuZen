import type { Permission, UserRole, UserStatus } from "@/types/enums";

/**
 * Every shape below is mirrored exactly from the backend's real DTOs
 * (domains/identity/application/dto/*.ts), grepped directly from the
 * backend source during this milestone. Two important corrections vs.
 * the approved roadmap's assumption:
 *
 * 1. Profile and change-password live on the AUTH router
 *    (`/api/v1/auth/profile`, `/api/v1/auth/change-password`), NOT
 *    `/api/v1/users/profile` as the roadmap's F4/P2 entries guessed
 *    ("or equivalent"). `/api/v1/users` only has permission grant/revoke
 *    routes. Documented here since this is a real backend-vs-assumption
 *    conflict per the project's source-of-truth rules.
 * 2. There is no logout endpoint on the backend at all — logout is a
 *    purely client-side action (clear tokens). Do not invent one.
 */

/** Mirrors LoginDto */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Mirrors RefreshTokenDto */
export interface RefreshTokenPayload {
  refreshToken: string;
}

/** Mirrors AuthResponseDto (returned by POST /auth/login and POST /auth/refresh) */
export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    organizationId: string;
    name: string;
    email: string;
    role: string;
  };
}

/** Mirrors ProfileResponseDto (returned by GET /auth/profile) — the canonical "current user" shape used everywhere in this app */
export interface ProfileResponseDto {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
  profile: {
    image: string;
    phone: string;
    bio: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors ForgotPasswordDto */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Mirrors ForgotPasswordResponseDto exactly — always an empty object,
 * whether or not the account exists (deliberately, to avoid revealing
 * account existence). The reset token is emailed directly to the
 * account's own address via the real SMTP-backed NodemailerEmailService
 * and never appears in this response — confirmed by reading
 * ForgotPasswordUseCase.ts directly, not assumed. This used to be
 * different: the token was returned here as a "development mode"
 * workaround before real email delivery existed, which was a genuine
 * security gap (anyone could obtain a valid reset token for any email
 * with no inbox access), now fixed.
 */
export type ForgotPasswordResponseDto = Record<string, never>;

/** Mirrors ResetPasswordDto */
export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

/** Mirrors VerifyInvitationDto */
export interface VerifyInvitationPayload {
  email: string;
  token: string;
}

/**
 * Mirrors VerifyInvitationResponseDto. Verifying has a real side
 * effect on the backend — it transitions the User from INVITED to
 * EMAIL_VERIFIED (clicking a link that could only have arrived via
 * the invitation email genuinely is the email-verification act) —
 * confirmed by reading VerifyInvitationUseCase directly, not assumed.
 */
export interface VerifyInvitationResponseDto {
  name: string;
  email: string;
  role: string;
  organizationName: string;
}

/** Mirrors AcceptInvitationDto — sets the real password and activates the account (EMAIL_VERIFIED -> ACTIVE). */
export interface AcceptInvitationPayload {
  email: string;
  token: string;
  password: string;
}

/**
 * Mirrors SessionResponseDto exactly. Each row is a genuinely real,
 * tracked login session (device/browser parsed from the real
 * User-Agent, real IP, real refresh-token rotation state) — confirmed
 * by reading Session.ts and RefreshTokenUseCase.ts directly. `isCurrent`
 * is computed server-side from the access token's own sessionId claim,
 * not guessed on the frontend.
 */
export interface SessionResponseDto {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  createdAt?: string;
  lastActiveAt: string;
  isCurrent: boolean;
}
