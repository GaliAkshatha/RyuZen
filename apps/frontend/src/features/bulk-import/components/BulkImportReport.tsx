import { AlertTriangle, CheckCircle2, Copy, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import type { BulkImportReportDto } from "@/features/bulk-import/types/bulk-import.types";

interface BulkImportReportProps {
  report: BulkImportReportDto;
}

/**
 * Every number and row here reflects a genuinely real outcome —
 * successfulImports each created a real User + Invitation (with a
 * real email sent) + Student record; nothing here is a preview or
 * simulation.
 */
export function BulkImportReport({ report }: BulkImportReportProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Rows" value={report.totalRows} />
        <StatCard label="Imported" value={report.successfulImports.length} tone="success" />
        <StatCard label="Duplicates" value={report.duplicates.length} tone="warning" />
        <StatCard
          label="Failed"
          value={report.validationFailures.length + report.skippedRecords.length}
          tone="destructive"
        />
      </div>

      {report.successfulImports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Successfully Imported ({report.successfulImports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
              {report.successfulImports.map((row) => (
                <li key={row.row}>
                  Row {row.row}: {row.name} ({row.email})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.duplicates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Copy className="h-4 w-4" aria-hidden="true" />
              Duplicates ({report.duplicates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
              {report.duplicates.map((row) => (
                <li key={row.row}>
                  Row {row.row}: {row.email ?? "(no email)"} — {row.reason}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.validationFailures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Validation Failures ({report.validationFailures.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
              {report.validationFailures.map((row) => (
                <li key={row.row}>
                  Row {row.row}: {row.email ?? "(no email)"} — {row.reason}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.skippedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Skipped ({report.skippedRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
              {report.skippedRecords.map((row) => (
                <li key={row.row}>
                  Row {row.row}: {row.email ?? "(no email)"} — {row.reason}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "warning" | "destructive";
}) {
  const toneClass = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  }[tone];

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
        <span className={`font-display text-2xl font-bold ${toneClass}`}>{value}</span>
        <span className="font-body text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
