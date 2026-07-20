import { UserRole } from "@/types/enums";

/**
 * Confirmed against achievement.routes.ts this milestone: Verify and
 * Reject are both gated to SUPER_ADMIN + ORG_ADMIN + FACULTY — a real
 * backend rule, matching Alumni's (A3) review pattern.
 */
export function canReviewAchievements(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN || role === UserRole.FACULTY;
}
