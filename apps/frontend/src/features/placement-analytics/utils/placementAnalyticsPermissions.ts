import { UserRole } from "@/types/enums";

/** Confirmed against placement-analytics.routes.ts: the single GET endpoint is ORG_ADMIN and PLACEMENT_ADMIN. */
export function canViewPlacementAnalytics(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN || role === UserRole.PLACEMENT_ADMIN;
}
