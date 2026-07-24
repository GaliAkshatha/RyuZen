import { UserRole } from "@/types/enums";

import type { PortalId } from "@/core/portal/portal.types";

/**
 * Maps a signed-in user's role to the experience/portal they belong
 * in. `undefined` (no user, i.e. not yet authenticated) resolves to
 * "public" — the marketing site and login entry point.
 *
 * SUPER_ADMIN is the only role in the Platform Application; every
 * other role (Student, Faculty, Alumni, Org Admin) shares the single
 * Organization Application, per the product's explicit design
 * principle: tenant determines the application experience, role
 * determines permissions within it — business features are never
 * duplicated per role.
 */
export function resolvePortal(role: UserRole | undefined): PortalId {
  if (!role) {
    return "public";
  }

  if (role === UserRole.SUPER_ADMIN) {
    return "platform";
  }

  return "organization";
}
