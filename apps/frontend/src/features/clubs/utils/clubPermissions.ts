import { UserRole } from "@/types/enums";

/**
 * Confirmed against club.routes.ts this milestone: Create, Update,
 * Delete, Assign Advisor, Add Member, and Remove Member are ALL gated
 * to SUPER_ADMIN + ORG_ADMIN only. Unlike submissionPermissions.ts,
 * this genuinely mirrors a real backend rule (authorizePermission is
 * applied consistently across every management route), not a
 * client-side-only safeguard.
 */
export function canManageClubs(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN;
}
