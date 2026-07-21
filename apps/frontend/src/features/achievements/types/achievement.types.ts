import { AchievementLevel, AchievementStatus } from "@/types/enums";

/**
 * Mirrors AchievementResponseDto exactly. Genuinely different pattern
 * from Skills/Education/Experience/Certifications (CE1-CE4): Submit/
 * Update/Delete are STUDENT-ONLY (not open to every role), matching
 * navRegistry's existing `[UserRole.STUDENT]` restriction (pre-verified
 * in F5). `studentId` is the owning Student.id (not User.id) —
 * ownership is enforced by resolving the caller's own Student record
 * server-side and comparing IDs ("You can only update your own
 * achievements.", 403), confirmed this milestone. Verify/Reject are
 * SUPER_ADMIN + ORG_ADMIN + FACULTY, matching Alumni's (A3) review
 * pattern. No feedback/reason field on reject — a plain no-body PATCH.
 */
export interface AchievementResponseDto {
  id: string;
  organizationId: string;
  studentId: string;
  facultyId?: string;
  title: string;
  description?: string;
  category?: string;
  level?: AchievementLevel;
  position?: string;
  certificateUrl?: string;
  proofUrl?: string;
  achievementDate: string;
  verifiedBy?: string;
  status: AchievementStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateAchievementDto — no studentId field; resolved server-side from the requesting user */
export interface CreateAchievementPayload {
  title: string;
  description?: string;
  category?: string;
  level?: AchievementLevel;
  position?: string;
  certificateUrl?: string;
  proofUrl?: string;
  achievementDate: string;
}

/** Mirrors UpdateAchievementDto — every field optional */
export interface UpdateAchievementPayload {
  title?: string;
  description?: string;
  category?: string;
  level?: AchievementLevel;
  position?: string;
  certificateUrl?: string;
  proofUrl?: string;
  achievementDate?: string;
}
