import { FacultyStatus } from "@/types/enums";

/**
 * Mirrors FacultyResponseDto exactly. Note `userId` is a bare reference
 * with no display-name resolution available within this milestone's
 * scope (no user-lookup endpoint exists yet — AD1 builds user
 * management) — the UI shows `employeeId`/`designation` as the
 * identifying label instead of a name.
 */
export interface FacultyResponseDto {
  id: string;
  organizationId: string;
  userId: string;
  departmentId?: string;
  employeeId: string;
  designation: string;
  specialization?: string;
  status: FacultyStatus;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mirrors CreateFacultyDto. `userId` must reference an existing
 * registered user — the backend has no "create a person" concept here,
 * only "attach a Faculty record to an existing User". Entered as a
 * plain text field in the form since no user-search endpoint is
 * available in this milestone's scope.
 */
export interface CreateFacultyPayload {
  userId: string;
  departmentId?: string;
  employeeId: string;
  designation: string;
  specialization?: string;
}

/** Mirrors UpdateFacultyDto */
export interface UpdateFacultyPayload {
  employeeId?: string;
  designation?: string;
  specialization?: string;
}

/** Mirrors AssignFacultyDepartmentDto */
export interface AssignFacultyDepartmentPayload {
  departmentId: string;
}
