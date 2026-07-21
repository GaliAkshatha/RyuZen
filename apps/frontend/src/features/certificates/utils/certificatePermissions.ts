import { UserRole } from "@/types/enums";

/**
 * Confirmed against certificate.routes.ts this milestone: Issue and
 * "list for a specific student" are both gated to SUPER_ADMIN +
 * ORG_ADMIN + FACULTY. GET /me is a genuine STUDENT-only self-service
 * endpoint (see useMyCertificates.ts).
 */
export function canIssueCertificates(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN || role === UserRole.FACULTY;
}
