import { SubmissionStatus } from "@/types/enums";
import type { ActivityAttachment } from "@/features/activities/types/activity.types";

/**
 * Mirrors SubmissionResponseDto exactly. `review` is always present (not
 * optional) even before any review has happened — check `status`
 * (PENDING/UNDER_REVIEW/RESUBMITTED vs APPROVED/REJECTED) to know
 * whether a review has actually occurred, not review.reviewedBy.
 *
 * SIGNIFICANT FINDING, confirmed this milestone: submission.routes.ts
 * has NO authorizeRoles/authorizePermission on any route at all — only
 * `authenticate`. Any authenticated user can technically submit,
 * review, approve, or reject via this API; there is no backend-enforced
 * restriction that only faculty/admins can review, or that a user
 * can't review their own or others' submissions. This app applies a
 * client-side UX safeguard (see submissionPermissions.ts) restricting
 * the Approve/Reject controls to FACULTY/ORG_ADMIN/SUPER_ADMIN as a
 * sensible product default — explicitly NOT a claimed backend rule.
 */
export interface SubmissionReview {
  reviewedBy: string;
  reviewedAt?: string;
  feedback: string;
  pointsAwarded: number;
}

export interface SubmissionResponseDto {
  id: string;
  activityId: string;
  organizationId: string;
  submittedBy: string;
  status: SubmissionStatus;
  remarks: string;
  attachments: ActivityAttachment[];
  review: SubmissionReview;
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateSubmissionDto — "attachments" requires at least 1 item */
export interface CreateSubmissionPayload {
  activityId: string;
  remarks: string;
  attachments: ActivityAttachment[];
}

/** Mirrors ResubmitSubmissionDto — same attachment requirement as create */
export interface ResubmitSubmissionPayload {
  remarks: string;
  attachments: ActivityAttachment[];
}

/** Mirrors ApproveSubmissionDto (PATCH /:id/approve) — no "status" field, implied APPROVED */
export interface ApproveSubmissionPayload {
  feedback: string;
  pointsAwarded: number;
}

/** Mirrors RejectSubmissionDto (PATCH /:id/reject) — feedback only, no pointsAwarded (backend always zeroes it) */
export interface RejectSubmissionPayload {
  feedback: string;
}

/** Mirrors SubmissionFilter (query params, all optional) */
export interface SubmissionListFilters {
  activityId?: string;
  submittedBy?: string;
  status?: SubmissionStatus;
}
