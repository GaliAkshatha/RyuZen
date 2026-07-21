/**
 * Every shape mirrors the backend's real DTOs
 * (domains/academic/departments/application/dto/*.ts), grepped this
 * milestone. `headOfDepartmentId` is a bare userId reference — the
 * backend has no endpoint to resolve it to a display name within this
 * milestone's scope, so the UI resolves it against the Faculty list's
 * own `userId` field where possible (see departmentLabels.ts).
 */
export interface DepartmentResponseDto {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartmentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateDepartmentDto */
export interface CreateDepartmentPayload {
  name: string;
  code: string;
  description?: string;
}

/** Mirrors UpdateDepartmentDto — note "code" is NOT updatable per the backend schema */
export interface UpdateDepartmentPayload {
  name?: string;
  description?: string;
}

/** Mirrors AssignHeadOfDepartmentDto */
export interface AssignHeadOfDepartmentPayload {
  userId: string;
}
