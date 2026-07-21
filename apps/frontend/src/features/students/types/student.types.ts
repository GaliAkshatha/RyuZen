import { StudentStatus } from "@/types/enums";

/**
 * Mirrors StudentResponseDto exactly. `mentorId` references a Faculty
 * entity's own `id` (not userId) — confirmed against AssignMentorDto
 * and AssignMentorUseCase, which take/store `facultyId` directly.
 */
export interface StudentResponseDto {
  id: string;
  organizationId: string;
  userId: string;
  departmentId?: string;
  mentorId?: string;
  usn: string;
  batch: string;
  semester: number;
  cgpa?: number;
  status: StudentStatus;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateStudentDto */
export interface CreateStudentPayload {
  userId: string;
  departmentId?: string;
  usn: string;
  batch: string;
  semester?: number;
  cgpa?: number;
}

/** Mirrors UpdateStudentDto — note "semester" is NOT updatable directly (only via promote) */
export interface UpdateStudentPayload {
  usn?: string;
  batch?: string;
  cgpa?: number;
}

/** Mirrors AssignMentorDto — a Faculty.id, not a userId */
export interface AssignMentorPayload {
  facultyId: string;
}
