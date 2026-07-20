import { UserRole } from "@/types/enums";

/**
 * Confirmed against event.routes.ts this milestone: Create, Update,
 * Delete, Publish, and GetRegistrations are ALL gated to SUPER_ADMIN +
 * ORG_ADMIN + FACULTY. This genuinely mirrors a real backend rule.
 */
export function canManageEvents(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN || role === UserRole.FACULTY;
}

/**
 * Confirmed against event.routes.ts this milestone: POST /:id/register
 * is gated to STUDENT ONLY — a real, hard backend rule (unlike
 * Activities' submission, which is open to any authenticated user).
 */
export function canRegisterForEvents(role: UserRole | undefined): boolean {
  return role === UserRole.STUDENT;
}
