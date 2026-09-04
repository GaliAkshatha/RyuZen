/** Matches the real backend FacultyResponseDto exactly - confirmed directly against FacultyResponseMapper.ts. */
export const FacultyStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type FacultyStatus = (typeof FacultyStatus)[keyof typeof FacultyStatus];

export interface Faculty {
  id: string;
  organizationId: string;
  userId: string;
  departmentId?: string;
  employeeId: string;
  designation: string;
  specialization?: string;
  status: FacultyStatus;
  /** The real User account's login-access status (ACTIVE/SUSPENDED/ARCHIVED) - distinct from `status` above (employment record status). */
  userStatus?: string;
  permissions?: string[];
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Matches CreateFacultySchema exactly - a real, deliberate business
 * rule confirmed directly: this requires an ALREADY-EXISTING real
 * user account (userId). "Create Faculty" links a profile
 * (employeeId/designation/department) to a user, it does not invite a
 * new person - that's a separate, not-yet-built Invitations concern.
 */
export interface CreateFacultyRequest {
  userId: string;
  departmentId?: string;
  employeeId: string;
  designation: string;
  specialization?: string;
}

/** Matches UpdateFacultySchema exactly - userId and departmentId deliberately absent (immutable / have their own dedicated endpoint respectively). */
export interface UpdateFacultyRequest {
  employeeId?: string;
  designation?: string;
  specialization?: string;
}

/** Matches the real AssignFacultyDepartmentUseCase's expected dto shape. */
export interface AssignFacultyDepartmentRequest {
  departmentId: string;
}
