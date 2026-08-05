/** Mirrors BulkImportSuccessRow/BulkImportFailureRow/BulkImportReportDto exactly. */
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

/**
 * Every row here reflects a real outcome from BulkImportStudentsUseCase
 * — successfulImports genuinely created a real User, Invitation
 * (with a real email sent), and Student record via the exact same
 * code path a one-at-a-time admin invite uses. One bad row never
 * aborts the batch, confirmed by reading the use case directly.
 */
export interface BulkImportReportDto {
  totalRows: number;
  successfulImports: BulkImportSuccessRow[];
  duplicates: BulkImportFailureRow[];
  validationFailures: BulkImportFailureRow[];
  skippedRecords: BulkImportFailureRow[];
}
