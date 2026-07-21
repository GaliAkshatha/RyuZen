/**
 * Mirrors BadgeResponseDto exactly. Notably has NO organizationId field
 * — badges are a global catalog, not org-scoped, confirmed this
 * milestone by the backend route comment ("Create Badge (global
 * catalog)") and the DTO shape itself. This is why Create/Update/Delete
 * are SUPER_ADMIN-only (excluding even ORG_ADMIN) — a platform-wide
 * concern, not an organization-level one.
 */
export interface BadgeResponseDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  criteria?: string;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mirrors StudentBadgeResponseDto exactly. `badge` is an optional
 * denormalized snapshot embedded directly in the response — no
 * separate catalog lookup is needed to display a student's earned
 * badges.
 */
export interface StudentBadgeResponseDto {
  id: string;
  studentId: string;
  badgeId: string;
  awardedBy: string;
  awardedAt: string;
  badge?: {
    name: string;
    description?: string;
    icon?: string;
    points: number;
  };
}

/** Mirrors CreateBadgeDto */
export interface CreateBadgePayload {
  name: string;
  description?: string;
  icon?: string;
  criteria?: string;
  points?: number;
}

/** Mirrors UpdateBadgeDto — every field optional */
export interface UpdateBadgePayload {
  name?: string;
  description?: string;
  icon?: string;
  criteria?: string;
  points?: number;
}

/** Mirrors AwardBadgeDto */
export interface AwardBadgePayload {
  studentId: string;
}
