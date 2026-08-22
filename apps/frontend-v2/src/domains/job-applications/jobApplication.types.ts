/** Matches the real backend JobApplicationResponseDto exactly. */
export const JobApplicationStatus = {
  APPLIED: "APPLIED",
  SHORTLISTED: "SHORTLISTED",
  REJECTED: "REJECTED",
  SELECTED: "SELECTED",
} as const;
export type JobApplicationStatus = (typeof JobApplicationStatus)[keyof typeof JobApplicationStatus];

export interface JobApplication {
  id: string;
  placementId: string;
  studentId: string;
  studentName?: string;
  studentUsn?: string;
  resume?: string;
  status: JobApplicationStatus;
  remarks?: string;
  appliedAt: string;
}

/** Matches ApplyToPlacementDto exactly - resume is optional, omitting it uses the student's saved resume automatically (confirmed real backend behavior, not a frontend assumption). */
export interface ApplyToPlacementRequest {
  resume?: string;
}

/** Matches UpdateJobApplicationStatusSchema exactly. */
export interface UpdateJobApplicationStatusRequest {
  status: JobApplicationStatus;
  remarks?: string;
}
