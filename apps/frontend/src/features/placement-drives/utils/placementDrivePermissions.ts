import { UserRole } from "@/types/enums";

/**
 * Confirmed against placement-drive.routes.ts this milestone: Create/
 * Update/Publish/Close/Delete are ORG_ADMIN ONLY, with SUPER_ADMIN
 * explicitly excluded — same pattern as Companies (PL1), stated
 * outright in the backend's own route-file comment.
 */
export function canManagePlacementDrives(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN;
}
