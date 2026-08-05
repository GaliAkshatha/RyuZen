import { SkillLevel } from "@/types/enums";

/**
 * Mirrors SkillResponseDto exactly. `userId` is the owning User.id
 * directly (not Student.id). Create/List/Get/Update/Delete have NO
 * role restriction at all beyond authentication (any authenticated
 * user — student, faculty, alumni, admin — can maintain their own
 * skill list), but Update/Delete DO enforce real ownership
 * server-side ("You can only update your own skills.", 403) even
 * though the route itself has no role gate. Verify is the one action
 * gated to SUPER_ADMIN + ORG_ADMIN + FACULTY.
 *
 * `source`/`confidence`/`evidence`/`approved` are new as of the AI
 * Skill Extraction pipeline (Ollama-backed): a skill with
 * `source: "AI_SUGGESTED"` and `approved: false` is a pending
 * suggestion, not yet a real skill — it's excluded from every
 * downstream score (Resume ATS score, Career Score's profile
 * completeness, the public portfolio view), confirmed by reading
 * every one of those use cases directly. `approved` is orthogonal to
 * `verified`: approved means the student confirmed the AI got it
 * right; verified means a faculty/admin separately signed off.
 */
export type SkillSource = "MANUAL" | "AI_SUGGESTED";

export interface SkillResponseDto {
  id: string;
  userId: string;
  name: string;
  category?: string;
  level?: SkillLevel;
  verified: boolean;
  source: SkillSource;
  confidence?: number;
  evidence?: string;
  approved: boolean;
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
