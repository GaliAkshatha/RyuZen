import { SkillLevel } from "@/types/enums";

/**
 * Mirrors SkillResponseDto exactly. `userId` is the owning User.id
 * directly (not Student.id) — confirmed this milestone. Create/List/
 * Get/Update/Delete have NO role restriction at all beyond
 * authentication (any authenticated user — student, faculty, alumni,
 * admin — can maintain their own skill list), but Update/Delete DO
 * enforce real ownership server-side ("You can only update your own
 * skills.", 403) even though the route itself has no role gate. Verify
 * is the one action gated to SUPER_ADMIN + ORG_ADMIN + FACULTY.
 */
export interface SkillResponseDto {
  id: string;
  userId: string;
  name: string;
  category?: string;
  level?: SkillLevel;
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateSkillDto */
export interface CreateSkillPayload {
  name: string;
  category?: string;
  level?: SkillLevel;
}

/** Mirrors UpdateSkillDto — every field optional */
export interface UpdateSkillPayload {
  name?: string;
  category?: string;
  level?: SkillLevel;
}
