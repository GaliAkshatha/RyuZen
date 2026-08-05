import { UserRole } from "@/types/enums";

/** Confirmed against job-application.routes.ts this milestone: applying and GET /me are both STUDENT-only. */
export function canApplyToPlacements(role: UserRole | undefined): boolean {
  return role === UserRole.STUDENT;
}

/** Confirmed against job-application.routes.ts: listing applications for a drive and updating status are ORG_ADMIN and PLACEMENT_ADMIN. */
export function canReviewJobApplications(role: UserRole | undefined): boolean {
  return role === UserRole.ORG_ADMIN || role === UserRole.PLACEMENT_ADMIN;
}
