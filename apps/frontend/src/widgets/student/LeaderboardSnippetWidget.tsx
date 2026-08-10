import { Link } from "react-router-dom";
import { Award, Crown } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { cn } from "@/utils/cn";

import { useLeaderboard } from "@/features/leaderboard/hooks/useLeaderboard";

/**
 * Wired in C4 — top 5 ranked students, from the same GET /leaderboard
 * every role can browse. Top-3 medal treatment reuses only existing
 * tokens (no new colors introduced) — rank #1 gets the primary/gold
 * crown treatment, #2 and #3 a quieter variant of the same idea, so
 * this reads as a smaller sibling of the full podium on the
 * Leaderboard page rather than a disconnected list.
 */
export function LeaderboardSnippetWidget() {
  const { data: entries, isLoading } = useLeaderboard();

  const top = [...(entries ?? [])].sort((a, b) => a.rank - b.rank).slice(0, 5);

  return (
    <WidgetCard title="Leaderboard" icon={Award} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : top.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No leaderboard entries yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {top.map((entry) => {
            const isTopThree = entry.rank <= 3;
            return (
              <li key={entry.id}>
                <Link
                  to={`/app/leaderboard/${entry.studentId}`}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 font-body text-sm text-foreground transition-colors hover:bg-accent/50",
                    entry.rank === 1 && "bg-primary/5",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {entry.rank === 1 ? (
                      <Crown className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                    ) : (
                      <span
                        className={cn(
                          "flex h-3.5 w-3.5 shrink-0 items-center justify-center font-mono text-[10px] font-bold",
                          isTopThree ? "text-primary/70" : "text-muted-foreground",
                        )}
                      >
                        {entry.rank}
                      </span>
                    )}
                    <span className="truncate">{entry.studentName ?? entry.studentId}</span>
                  </span>
                  <span className="shrink-0 font-medium text-muted-foreground">
                    {entry.totalPoints.toLocaleString()} pts
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </WidgetCard>
  );
}
