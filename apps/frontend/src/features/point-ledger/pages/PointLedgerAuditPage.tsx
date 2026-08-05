import { CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";

import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { Card, CardContent } from "@/shared/components/Card";
import { cn } from "@/utils/cn";

import { usePointLedgerAudit } from "@/features/point-ledger/hooks/usePointLedgerAudit";
import type { PointLedgerEntryResponseDto } from "@/features/point-ledger/types/point-ledger.types";

/**
 * The organization's full point ledger, plus a REAL verification
 * result — `isValid` is independently recomputed by
 * GetPointLedgerAuditUseCase on every request (recomputing every
 * entry's hash and confirming the chain), not a stored flag this page
 * just displays. If `isValid` is false, `brokenAtTransactionId`
 * identifies exactly which transaction the chain broke at.
 */
export function PointLedgerAuditPage() {
  const { data: audit, isLoading, isError, error, refetch } = usePointLedgerAudit();

  const columns: DataGridColumn<PointLedgerEntryResponseDto>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (e) => new Date(e.timestamp).toLocaleString(),
      sortable: true,
      sortValue: (e) => new Date(e.timestamp).getTime(),
    },
    { key: "studentId", header: "Student ID", render: (e) => e.studentId },
    {
      key: "points",
      header: "Points",
      render: (e) => (
        <span className={e.points > 0 ? "text-success" : "text-destructive"}>
          {e.points > 0 ? "+" : ""}
          {e.points}
        </span>
      ),
      sortable: true,
      sortValue: (e) => e.points,
    },
    { key: "reason", header: "Reason", render: (e) => e.reason },
    {
      key: "hash",
      header: "Hash",
      render: (e) => (
        <span className="font-mono text-xs text-muted-foreground">{e.hash.slice(0, 12)}…</span>
      ),
    },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="arcane-grid" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
        Point Ledger Audit
      </h1>

      {isLoading ? (
        <SkeletonLoader className="h-24" />
      ) : audit ? (
        <>
          <Card
            className={cn(
              "border",
              audit.isValid ? "border-success/30 bg-success/5" : "border-destructive/40 bg-destructive/5",
            )}
          >
            <CardContent className="flex items-center gap-3 p-4">
              {audit.isValid ? (
                <>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <p className="font-body text-sm text-foreground">
                    Chain verified — every entry's hash was independently recomputed and matches, and
                    every entry correctly chains to the one before it.
                  </p>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                  <p className="font-body text-sm text-foreground">
                    Verification FAILED — the chain broke at transaction{" "}
                    <span className="font-mono text-xs">{audit.brokenAtTransactionId}</span>. Records
                    after this point can no longer be trusted as unaltered.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {audit.entries.length === 0 ? (
            <EmptyState
              title="No point transactions yet"
              description="Every approved submission, event attendance confirmation, and manual point adjustment in this organization will appear here."
            />
          ) : (
            <DataGrid
              data={audit.entries}
              columns={columns}
              getRowId={(e) => e.id}
              searchable
              searchPlaceholder="Search by reason…"
              getSearchableText={(e) => e.reason}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
