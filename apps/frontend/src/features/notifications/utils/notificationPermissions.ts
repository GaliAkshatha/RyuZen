import { UserRole } from "@/types/enums";

/**
 * Confirmed against notification.routes.ts this milestone: Send is
 * gated to ORG_ADMIN + FACULTY, with SUPER_ADMIN explicitly excluded —
 * the backend's own route comment notes FACULTY's inclusion nominally
 * requires a specific permission assignment, but since no granular
 * permission-enforcement middleware exists in this codebase, it's
 * scoped by role alone.
 */
export function canSendNotifications(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN || role === UserRole.FACULTY;
}
