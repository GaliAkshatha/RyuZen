import { UserRole } from "@/types/enums";

/**
 * Confirmed against badge.routes.ts this milestone: Create/Update/
 * Delete are SUPER_ADMIN ONLY — excluding even ORG_ADMIN, since badges
 * are a global platform-wide catalog, not an organization-level
 * resource (see badge.types.ts for the full finding).
 */
export function canManageBadgeCatalog(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN;
}

/**
 * Confirmed against badge.routes.ts this milestone: Awarding a badge to
 * a student is a broader SUPER_ADMIN + ORG_ADMIN + FACULTY permission —
 * distinct from catalog management above.
 */
export function canAwardBadges(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN || role === UserRole.FACULTY;
}
