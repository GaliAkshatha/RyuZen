/** Matches the real backend DepartmentResponseDto exactly - confirmed directly against DepartmentResponseMapper.ts. */
export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartmentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches CreateDepartmentSchema exactly - organizationId is server-injected, not sent by the client. */
export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
}

/** Matches UpdateDepartmentSchema exactly - code is deliberately NOT here. Confirmed: the real schema only accepts name/description on update; code is immutable after creation. */
export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
}

/** Matches AssignHeadOfDepartmentSchema - a real User id, not a Faculty entity id (confirmed field name directly). */
export interface AssignHeadOfDepartmentRequest {
  userId: string;
}
