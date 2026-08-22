/** Matches the real backend SubmissionResponseDto exactly. */
export const SubmissionStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export interface Review {
  reviewedBy?: string;
  reviewedAt?: string;
  feedback: string;
  pointsAwarded: number;
}

export interface Submission {
  id: string;
  activityId: string;
  organizationId: string;
  submittedBy: string;
  /** Real server-side enrichment, added this pass - closes a gap where a reviewer only ever saw a raw user id. */
  submittedByName?: string;
  submittedByUsn?: string;
  status: SubmissionStatus;
  remarks: string;
  attachments: { name: string; url: string; mimeType: string }[];
  review: Review;
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches CreateSubmissionSchema exactly - attachments genuinely requires at least one entry, not optional; remarks defaults to empty string. */
export interface CreateSubmissionRequest {
  activityId: string;
  remarks?: string;
  attachments: { name: string; url: string; mimeType: string }[];
}

/** Matches ApproveSubmissionSchema exactly - both fields are genuinely required, not optional (feedback must be non-empty, confirmed directly). */
export interface ApproveSubmissionRequest {
  feedback: string;
  pointsAwarded: number;
}

/** Matches RejectSubmissionSchema exactly - feedback is required, not optional. */
export interface RejectSubmissionRequest {
  feedback: string;
}
