/**
 * Confirmed directly against the real backend enum
 * (domains/identity/domain/constants/UserRole.ts) - 7 real roles, not
 * the 5 the initial product brief assumed.
 *
 * `as const` object + derived union type, not `enum` - this Vite
 * template runs with `erasableSyntaxOnly` (real `enum` generates
 * runtime JS, which that setting disallows). This pattern gives the
 * same real, exhaustive union with zero runtime cost either way.
 */
export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  PLACEMENT_ADMIN: "PLACEMENT_ADMIN",
  FACULTY: "FACULTY",
  STUDENT: "STUDENT",
  ALUMNI: "ALUMNI",
  RECRUITER: "RECRUITER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/** Confirmed directly against domains/identity/domain/constants/UserStatus.ts */
export const UserStatus = {
  INVITED: "INVITED",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  ARCHIVED: "ARCHIVED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
