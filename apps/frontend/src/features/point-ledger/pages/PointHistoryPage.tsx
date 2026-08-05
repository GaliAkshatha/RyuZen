import { Coins, TrendingDown, TrendingUp } from "lucide-react";

import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { Card, CardContent } from "@/shared/components/Card";
import { cn } from "@/utils/cn";

import { useMyPointHistory } from "@/features/point-ledger/hooks/useMyPointHistory";

/**
 * A student's own real point transaction history — every row here is a
 * genuine, immutable ledger entry (see PointLedgerEntry.ts on the
 * backend), not derived or recomputed for display. Positive entries
 * are awards (submission approvals, event attendance); negative
 * entries are corrections.
 */
export function PointHistoryPage() {
  const { data: entries, isLoading, isError, error, refetch } = useMyPointHistory();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex max-w-2xl flex-col gap-6">
      <PageAtmosphere variant="constellation" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Coins className="h-6 w-6 text-primary" aria-hidden="true" />
        Point History
      </h1>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-16" />
          ))}
        </div>
      ) : !entries || entries.length === 0 ? (
        <EmptyState
          title="No point transactions yet"
          description="Every point you earn from approved activities, event attendance, or an admin adjustment will show up here, permanently."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => {
            const isPositive = entry.points > 0;
            return (
              <li key={entry.id}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1",
                          isPositive
                            ? "bg-success/10 text-success ring-success/30"
                            : "bg-destructive/10 text-destructive ring-destructive/30",
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-body text-sm font-medium text-foreground">{entry.reason}</span>
                        <span className="font-body text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "font-display text-lg font-bold",
                        isPositive ? "text-success" : "text-destructive",
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {entry.points}
                    </span>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
