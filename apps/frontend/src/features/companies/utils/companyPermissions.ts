import { UserRole } from "@/types/enums";

/**
 * Confirmed against company.routes.ts: Create/Update/UpdateStatus/
 * Delete are ORG_ADMIN and PLACEMENT_ADMIN, with SUPER_ADMIN
 * explicitly excluded — the inverse of almost every other admin
 * resource in this app, where SUPER_ADMIN has the broadest access.
 */
export function canManageCompanies(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN || role === UserRole.PLACEMENT_ADMIN;
}
