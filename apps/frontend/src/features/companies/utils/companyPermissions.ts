import { UserRole } from "@/types/enums";

/**
 * Confirmed against company.routes.ts this milestone: Create/Update/
 * UpdateStatus/Delete are ORG_ADMIN ONLY, with SUPER_ADMIN explicitly
 * excluded — stated outright in the backend's own route-file comment,
 * not an inference. The inverse of almost every other admin resource
 * in this app, where SUPER_ADMIN has the broadest access.
 */
export function canManageCompanies(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN;
}
