import { Coins } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Spinner } from "@/shared/components/Spinner";

import { useStudentPointHistory } from "@/features/point-ledger/hooks/useStudentPointHistory";

/**
 * Embedded in StudentDetailPage - the real, previously-unused
 * useStudentPointHistory hook (backend GET /point-ledger/:studentId,
 * FACULTY/ORG_ADMIN/SUPER_ADMIN) finally has a UI. studentId is the
 * Student entity's own id, matching how RecordGrowthEventUseCase
 * writes ledger entries elsewhere - not the User id.
 */
export function StudentPointHistorySection({ studentId }: { studentId: string }) {
  const { data: entries, isLoading } = useStudentPointHistory(studentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" aria-hidden="true" />
          Point History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Spinner size="sm" />
        ) : !entries || entries.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No points recorded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.slice(0, 10).map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-2">
                <span className="font-body text-sm text-foreground">{entry.reason}</span>
                <span
                  className={`shrink-0 font-body text-sm font-medium ${entry.points >= 0 ? "text-success" : "text-destructive"}`}
                >
                  {entry.points >= 0 ? "+" : ""}
                  {entry.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
