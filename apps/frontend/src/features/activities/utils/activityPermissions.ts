import { UserRole } from "@/types/enums";

/**
 * Confirmed against activity.routes.ts this milestone: Create, Update,
 * Publish, Close, and Delete are ALL gated to SUPER_ADMIN + FACULTY
 * only — ORG_ADMIN is explicitly excluded, unlike most other admin
 * resources in this app where ORG_ADMIN has management rights
 * alongside SUPER_ADMIN. GET (list/detail) has no role restriction
 * beyond authentication, so every role can browse.
 */
export function canManageActivities(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.FACULTY;
}
