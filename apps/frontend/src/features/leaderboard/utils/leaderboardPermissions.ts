import { UserRole } from "@/types/enums";

/**
 * Confirmed against leaderboard.routes.ts this milestone: Recalculate
 * and Adjust Points are both gated to SUPER_ADMIN + ORG_ADMIN. GET /
 * (browse) and GET /:studentId (view one entry) have no role
 * restriction beyond authentication — every role can browse.
 */
export function canAdjustLeaderboard(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN;
}
