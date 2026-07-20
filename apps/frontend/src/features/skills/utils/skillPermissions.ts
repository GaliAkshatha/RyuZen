import { UserRole } from "@/types/enums";

/**
 * Confirmed against skill.routes.ts this milestone: Verify is gated to
 * SUPER_ADMIN + ORG_ADMIN + FACULTY. Every other action (create, list,
 * get, update, delete) has no role restriction at all — ownership is
 * enforced server-side per-record instead (see skill.types.ts).
 */
export function canVerifySkills(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN || role === UserRole.FACULTY;
}
