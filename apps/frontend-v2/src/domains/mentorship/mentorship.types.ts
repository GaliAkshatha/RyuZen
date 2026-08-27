/** Matches the real backend MentorshipResponseDto exactly. */
export const MentorshipStatus = { ACTIVE: "ACTIVE", COMPLETED: "COMPLETED", CANCELLED: "CANCELLED" } as const;
export type MentorshipStatus = (typeof MentorshipStatus)[keyof typeof MentorshipStatus];

export interface Mentorship {
  id: string;
  organizationId: string;
  facultyId: string;
  studentId: string;
  studentName?: string;
  studentUsn?: string;
  studentUserId?: string;
  assignedBy: string;
  assignedDate: string;
  status: MentorshipStatus;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches UpdateMentorshipSchema exactly - remarks is genuinely required, not optional. */
export interface UpdateMentorshipRequest {
  remarks: string;
}
