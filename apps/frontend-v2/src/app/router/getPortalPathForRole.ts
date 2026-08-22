import { UserRole } from "@/shared/types/enums";

/**
 * Real per-role landing path. Portal implementations arrive one role
 * at a time in later phases - for now every path resolves to the
 * same placeholder root, which is honest about what's actually built
 * versus routing to a page that doesn't exist yet.
 */
export function getPortalPathForRole(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "/platform";
    case UserRole.ORG_ADMIN:
      return "/organization";
    case UserRole.PLACEMENT_ADMIN:
      return "/placement-admin";
    case UserRole.RECRUITER:
      return "/recruiter";
    case UserRole.FACULTY:
      return "/faculty";
    case UserRole.STUDENT:
      return "/student";
    case UserRole.ALUMNI:
      return "/alumni";
    default:
      return "/";
  }
}
