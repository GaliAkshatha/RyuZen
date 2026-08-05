import { useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import { Spinner } from "@/shared/components/Spinner";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { cn } from "@/utils/cn";

import { useBulkImportStudents } from "@/features/bulk-import/hooks/useBulkImportStudents";
import { BulkImportReport } from "@/features/bulk-import/components/BulkImportReport";

/**
 * CSV only for now — the backend deliberately does not support .xlsx
 * yet (a real dependency-security tradeoff: the well-known .xlsx
 * parsers either have an unpatched high-severity vulnerability or
 * pull in a large zip-writing dependency chain this read-only feature
 * doesn't need). Export from Excel as CSV first.
 */
export function BulkImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate, isPending, error, data: report, reset } = useBulkImportStudents();

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) return;
    reset();
    setSelectedFile(file);
  }

  function handleImport() {
    if (selectedFile) {
      mutate(selectedFile);
    }
  }

  return (
    <div className="relative flex max-w-2xl flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <FileSpreadsheet className="h-6 w-6 text-primary" aria-hidden="true" />
        Bulk Import Students
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="font-body text-sm text-muted-foreground">
            Columns: Name, Email, USN, Branch, Section, Semester, Batch, Admission Year, Graduation
            Year, 10th Percentage, 12th Percentage, Entrance Rank. Only Name, Email, USN, and Batch
            are required — everything else can be left blank.
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <span className="font-body text-sm text-foreground">
              {selectedFile ? selectedFile.name : "Click to select or drag a CSV file here"}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </button>

          <Button onClick={handleImport} disabled={!selectedFile || isPending} className="self-start">
            {isPending ? "Importing…" : "Import Students"}
          </Button>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      )}

      {error && <ErrorState error={error} />}

      {report && <BulkImportReport report={report} />}
    </div>
  );
}
