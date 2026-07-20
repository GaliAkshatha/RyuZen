import { MentorshipStatus } from "@/types/enums";

/**
 * Mirrors MentorshipResponseDto exactly. `facultyId`/`studentId`
 * reference Faculty.id/Student.id directly (not userId) — same
 * convention as AssignMentorDto (A2), resolved via facultyLabels.ts /
 * studentLabels.ts.
 *
 * No CREATE endpoint exists on mentorship.routes.ts — confirmed this
 * milestone, only GET/GET-by-id/PATCH/complete/cancel. Mentorship
 * records are created implicitly as a side effect of Student's
 * assign-mentor action (A2's AssignMentorUseCase), not directly here.
 */
export interface MentorshipResponseDto {
  id: string;
  organizationId: string;
  facultyId: string;
  studentId: string;
  assignedBy: string;
  assignedDate: string;
  status: MentorshipStatus;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors UpdateMentorshipDto — "remarks" is the only updatable field */
export interface UpdateMentorshipPayload {
  remarks: string;
}

/** Mirrors GetMentorshipsFilterDto (query params, all optional) */
export interface MentorshipListFilters {
  studentId?: string;
  facultyId?: string;
  status?: string;
}
