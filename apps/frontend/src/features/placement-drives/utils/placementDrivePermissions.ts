import { UserRole } from "@/types/enums";

/**
 * Confirmed against placement-drive.routes.ts: Create/Update/Publish/
 * Close/Delete are ORG_ADMIN and PLACEMENT_ADMIN, with SUPER_ADMIN
 * explicitly excluded — same pattern as Companies.
 */
export function canManagePlacementDrives(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN || role === UserRole.PLACEMENT_ADMIN;
}
