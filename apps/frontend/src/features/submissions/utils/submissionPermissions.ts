import { UserRole } from "@/types/enums";

/**
 * submission.routes.ts has no role authorization anywhere (confirmed
 * this milestone) — any authenticated user could technically call
 * PATCH /:id/approve or /:id/reject. This is a client-side UX
 * safeguard only, restricting the Approve/Reject controls to the roles
 * that make product sense, NOT a claimed backend rule. If the backend
 * later adds real authorization here, this should be revisited.
 */
export function canReviewSubmissions(role: UserRole | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ORG_ADMIN || role === UserRole.FACULTY;
}
