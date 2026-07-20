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

/** Mirrors RegisterUserDto (request body for POST /auth/register) */
export interface RegisterPayload {
  organizationCode: string;
  name: string;
  email: string;
  password: string;
}

/**
 * Mirrors RegisterUserResponseDto. Deliberately does NOT include tokens
 * — confirmed against the backend, registration does not log the user
 * in; they must separately POST /auth/login afterward.
 */
export interface RegisterUserResponseDto {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

/** Mirrors ForgotPasswordDto */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Mirrors ForgotPasswordResponseDto exactly. `resetToken` is only
 * present when the account exists (an empty object is returned
 * otherwise, deliberately, to avoid revealing account existence — see
 * ForgotPasswordUseCase.ts). The backend's own source comments confirm
 * this is returned directly in the response only because no email
 * delivery infrastructure exists yet ("TODO: deliver via the
 * Notifications/Email module once available") — not a permanent design,
 * and the UI must present it as a temporary development convenience,
 * not as if it were delivered by email.
 */
export interface ForgotPasswordResponseDto {
  resetToken?: string;
}

/** Mirrors ResetPasswordDto */
export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}
