import { useRef, useState } from "react";
import { Upload, CheckCircle2, XCircle, AlertTriangle, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { useBulkImportStudents } from "@/domains/students/hooks/useBulkImportStudents";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real multipart CSV upload against a real, well-built backend
 * (BulkStudentRowSchema, confirmed directly - normalizes blank cells
 * before validation so an empty "Semester" cell never silently
 * becomes 0). Required columns confirmed against the real schema:
 * name, email, usn, batch. Everything else is optional, matching
 * CreateStudentDto.
 */
export function BulkImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);
  const { mutate: bulkImport, isPending, data: report } = useBulkImportStudents();

  function handleSubmit() {
    if (!selectedFile) return;
    setSubmitError(null);
    bulkImport(selectedFile, { onError: (err) => setSubmitError(err) });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Bulk import students</h1>
        <p className="text-sm text-muted-foreground">Upload a CSV to create many student profiles at once.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Required columns</CardTitle>
          <CardDescription>name, email, usn, batch. Optional: branch, section, semester, admissionYear, graduationYear, tenthPercentage, twelfthPercentage, entranceRank.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            <Upload className="h-6 w-6" aria-hidden="true" />
            {selectedFile ? (
              <span className="flex items-center gap-1.5 text-foreground"><FileText className="h-4 w-4" />{selectedFile.name}</span>
            ) : (
              "Click to choose a CSV file"
            )}
          </button>

          {submitError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {submitError.message}
            </p>
          )}

          <Button disabled={!selectedFile || isPending} onClick={handleSubmit} className="w-fit">
            {isPending ? "Importing…" : "Import students"}
          </Button>
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Import report</CardTitle>
            <CardDescription>{report.totalRows} rows processed.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-md border border-success/30 bg-success/5 p-3 text-center">
                <p className="text-xl font-semibold text-success">{report.successfulImports.length}</p>
                <p className="text-xs text-muted-foreground">Imported</p>
              </div>
              <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-center">
                <p className="text-xl font-semibold text-warning">{report.duplicates.length}</p>
                <p className="text-xs text-muted-foreground">Duplicates</p>
              </div>
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-center">
                <p className="text-xl font-semibold text-destructive">{report.validationFailures.length}</p>
                <p className="text-xs text-muted-foreground">Invalid rows</p>
              </div>
              <div className="rounded-md border border-border bg-muted p-3 text-center">
                <p className="text-xl font-semibold text-foreground">{report.skippedRecords.length}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>

            {report.successfulImports.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-success"><CheckCircle2 className="h-3.5 w-3.5" />Imported</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {report.successfulImports.map((r) => (
                    <p key={r.row}>Row {r.row}: {r.name} ({r.email})</p>
                  ))}
                </div>
              </div>
            )}

            {[...report.validationFailures, ...report.duplicates].length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-destructive"><XCircle className="h-3.5 w-3.5" />Failed</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {[...report.validationFailures, ...report.duplicates].map((r) => (
                    <p key={r.row}>Row {r.row}{r.email ? ` (${r.email})` : ""}: {r.reason}</p>
                  ))}
                </div>
              </div>
            )}

            {report.skippedRecords.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><AlertTriangle className="h-3.5 w-3.5" />Skipped</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {report.skippedRecords.map((r) => (
                    <p key={r.row}>Row {r.row}: {r.reason}</p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
