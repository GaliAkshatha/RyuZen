import { ShieldCheck, ShieldAlert, ScrollText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { usePointLedgerAudit } from "@/domains/point-ledger/hooks/usePointLedgerAudit";

/**
 * Real gap filled: GET /point-ledger/audit existed on the backend - a
 * genuinely sophisticated feature (a hash-chained, tamper-evident
 * ledger, verified fresh on every read by independently recomputing
 * every entry's hash and confirming the chain, not trusted from
 * storage) with zero frontend caller anywhere in the app. This is the
 * one place that real verification result is actually shown.
 */
export function LedgerAuditPage() {
  const { data: audit, isLoading, isError, error, refetch } = usePointLedgerAudit();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !audit) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Point ledger audit</h1>
        <p className="text-sm text-muted-foreground">Every point transaction, independently re-verified against its hash chain.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          {audit.isValid ? (
            <>
              <ShieldCheck className="h-6 w-6 text-success" aria-hidden="true" />
              <div>
                <p className="font-semibold text-success">Chain verified</p>
                <p className="text-xs text-muted-foreground">Every entry's hash and chain link were independently recomputed and matched.</p>
              </div>
            </>
          ) : (
            <>
              <ShieldAlert className="h-6 w-6 text-destructive" aria-hidden="true" />
              <div>
                <p className="font-semibold text-destructive">Chain integrity broken</p>
                <p className="text-xs text-muted-foreground">
                  Verification first failed at transaction <span className="font-mono">{audit.brokenAtTransactionId}</span>. Entries from this
                  point may have been altered.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-primary" aria-hidden="true" />
            All transactions ({audit.entries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audit.entries.length === 0 ? (
            <EmptyState title="No transactions recorded yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {audit.entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="text-foreground">{entry.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()} · <span className="font-mono">{entry.transactionId}</span>
                    </p>
                  </div>
                  <span className={`font-semibold ${entry.points >= 0 ? "text-success" : "text-destructive"}`}>
                    {entry.points >= 0 ? "+" : ""}
                    {entry.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
