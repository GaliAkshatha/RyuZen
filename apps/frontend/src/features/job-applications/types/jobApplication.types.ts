import { JobApplicationStatus } from "@/types/enums";

/**
 * Mirrors JobApplicationResponseDto exactly. Apply is STUDENT-only,
 * confirmed this milestone with real, layered business rules in
 * ApplyToPlacementUseCase: the drive must exist, must be PUBLISHED
 * ("This placement drive is not open for applications.", 400), its
 * deadline (if set) must not have passed ("The application deadline
 * for this placement drive has passed.", 400), and a student cannot
 * apply twice ("You have already applied to this placement drive.",
 * 409). If `resume` is omitted, the backend automatically falls back
 * to the student's saved CE6 Resume URL — a genuine cross-feature
 * integration, not a gap.
 */
export interface JobApplicationResponseDto {
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

/** Mirrors ApplyToPlacementDto — resume is optional; omitting it uses the student's saved resume automatically */
export interface ApplyToPlacementPayload {
  resume?: string;
}

/** Mirrors UpdateJobApplicationStatusDto */
export interface UpdateJobApplicationStatusPayload {
  status: JobApplicationStatus;
  remarks?: string;
}
