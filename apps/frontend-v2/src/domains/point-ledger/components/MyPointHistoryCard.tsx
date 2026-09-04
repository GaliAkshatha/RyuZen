import { History } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useMyPointLedger } from "@/domains/point-ledger/hooks/useMyPointLedger";

/**
 * Real gap filled: GET /point-ledger/me existed on the backend (a
 * real hash-chained, tamper-evident transaction ledger - not just a
 * running total, an actual append-only record of every award/
 * deduction) with zero frontend caller anywhere in the app.
 */
export function MyPointHistoryCard() {
  const { data: entries, isLoading } = useMyPointLedger();

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" aria-hidden="true" />
          Point history
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!entries || entries.length === 0 ? (
          <EmptyState title="No point transactions yet" />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="text-foreground">{entry.reason}</p>
                  <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString()}</p>
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
  );
}
