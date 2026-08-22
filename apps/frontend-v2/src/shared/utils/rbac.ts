import { UserRole } from "@/shared/types/enums";

/**
 * IMPORTANT, confirmed via direct source inspection: despite its name,
 * the backend's real authorization middleware (authorizePermission,
 * used 172 times across every route file) takes UserRole values, not
 * Permission values - it is genuinely role-based, not permission-based,
 * regardless of naming. The `permissions` array returned on a user's
 * profile is real data but is NOT consulted by that primary
 * enforcement path anywhere confirmed.
 *
 * hasRole() is therefore the authoritative, backend-aligned check.
 * hasPermission() exists because the data is real and may be useful
 * for finer-grained UX decisions, but must not be treated as
 * equivalent to what the backend actually enforces.
 */

export function hasRole(userRole: UserRole | undefined, ...allowed: UserRole[]): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole);
}

export function hasAnyRole(userRole: UserRole | undefined, allowed: UserRole[]): boolean {
  return hasRole(userRole, ...allowed);
}

/** Secondary check only - see the module-level note above before relying on this for anything security-relevant. */
export function hasPermission(userPermissions: string[] | undefined, permission: string): boolean {
  return (userPermissions ?? []).includes(permission);
}

export function hasAnyPermission(userPermissions: string[] | undefined, permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(userPermissions, p));
}

export function hasAllPermissions(userPermissions: string[] | undefined, permissions: string[]): boolean {
  return permissions.every((p) => hasPermission(userPermissions, p));
}
