/**
 * Mirrors UpdateProfileSchema exactly (all fields optional at the
 * schema level, but each still enforces its own constraints if
 * provided — see profile.schemas.ts). Response is ProfileResponseDto
 * (features/auth/types/auth.types.ts) — the same shape everywhere,
 * reused rather than duplicated.
 */
export interface UpdateProfilePayload {
  name?: string;
  profile?: {
    image?: string;
    phone?: string;
    bio?: string;
  };
}

/** Mirrors ChangePasswordSchema exactly */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
