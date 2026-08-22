/**
 * Matches the real backend StudentResponseDto exactly - confirmed
 * directly against StudentResponseMapper.ts. IStudent (the wider
 * entity interface) has several bulk-import-only fields
 * (section/admissionYear/graduationYear/tenthPercentage/etc.) that
 * the mapper deliberately does not return - not included here either,
 * since the type must match what the API actually sends back, not
 * the entity's full internal shape.
 */
export const StudentStatus = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export interface Student {
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

/** Matches CreateStudentSchema exactly - same real business rule as Faculty: links a profile to an already-existing user account. */
export interface CreateStudentRequest {
  userId: string;
  departmentId?: string;
  usn: string;
  batch: string;
  semester?: number;
  cgpa?: number;
}

/** Matches UpdateStudentSchema exactly - semester deliberately absent (PromoteSemesterUseCase owns that transition, confirmed as a no-body action, not a settable field). */
export interface UpdateStudentRequest {
  usn?: string;
  batch?: string;
  cgpa?: number;
}

/** Matches the real AssignMentorDto - facultyId, a real Faculty entity id, not a raw user id (a genuinely different id space than Faculty's own creation, which uses userId). */
export interface AssignMentorRequest {
  facultyId: string;
}

/** Matches the real backend BulkImportReportDto exactly. */
export interface BulkImportSuccessRow {
  row: number;
  name: string;
  email: string;
  userId: string;
}

export interface BulkImportFailureRow {
  row: number;
  email?: string;
  reason: string;
}

export interface BulkImportReport {
  totalRows: number;
  successfulImports: BulkImportSuccessRow[];
  duplicates: BulkImportFailureRow[];
  validationFailures: BulkImportFailureRow[];
  skippedRecords: BulkImportFailureRow[];
}
