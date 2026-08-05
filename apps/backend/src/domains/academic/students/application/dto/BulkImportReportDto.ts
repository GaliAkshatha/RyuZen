export interface BulkImportSuccessRow {

    row: number;

    name: string;

    email: string;

    userId: string;

}

export interface BulkImportFailureRow {

    row: number;

    /** Whatever real data was present for this row, for the admin to identify it (blank fields included as-is). */
    email?: string;

    reason: string;

}

export interface BulkImportReportDto {

    totalRows: number;

    successfulImports: BulkImportSuccessRow[];

    duplicates: BulkImportFailureRow[];

    validationFailures: BulkImportFailureRow[];

    skippedRecords: BulkImportFailureRow[];

}
