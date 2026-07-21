import { UserRole } from "@/types/enums";

/** Confirmed against job-application.routes.ts this milestone: applying and GET /me are both STUDENT-only. */
export function canApplyToPlacements(role: UserRole | undefined): boolean {
  return role === UserRole.STUDENT;
}

/** Confirmed against job-application.routes.ts this milestone: listing applications for a drive and updating status are both ORG_ADMIN-only. */
export function canReviewJobApplications(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN;
}
