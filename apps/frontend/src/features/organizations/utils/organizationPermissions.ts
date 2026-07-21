import { UserRole } from "@/types/enums";

/** Confirmed against organization.routes.ts: every action is SUPER_ADMIN ONLY — no ORG_ADMIN access at all, the inverse scope of Placements' ORG_ADMIN-only pattern. */
export function canManageOrganizations(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN;
}
