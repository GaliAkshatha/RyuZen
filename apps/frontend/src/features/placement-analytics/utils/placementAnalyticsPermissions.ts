import { UserRole } from "@/types/enums";

/** Confirmed against placement-analytics.routes.ts this milestone: the single GET endpoint is ORG_ADMIN-only, same pattern as Companies/Drives/Applications review (PL1-PL3). */
export function canViewPlacementAnalytics(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN;
}
