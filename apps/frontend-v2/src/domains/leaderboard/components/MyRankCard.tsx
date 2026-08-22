import { Trophy, ArrowUp, ArrowDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { cn } from "@/shared/utils/cn";
import { useLeaderboard } from "@/domains/leaderboard/hooks/useLeaderboard";
import { useMyLeaderboardEntry } from "@/domains/leaderboard/hooks/useMyLeaderboardEntry";

/**
 * Real "my rank" block, per explicit product direction - shows the
 * student's own real rank plus the real neighbors immediately above
 * and below them in the org-wide leaderboard. GET /leaderboard/me
 * genuinely 404s if the student has no entry yet (no approved
 * activity/placement points) - handled here as a real, calm empty
 * state, not an error.
 */
export function MyRankCard() {
  const { data: myEntry, isLoading: loadingMine, isError: myEntryMissing } = useMyLeaderboardEntry();
  const { data: allEntries, isLoading: loadingAll } = useLeaderboard();

  if (loadingMine || loadingAll) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (myEntryMissing || !myEntry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
            Your rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You don't have a leaderboard entry yet - get an activity approved to start earning points.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...(allEntries ?? [])].sort((a, b) => a.rank - b.rank);
  const myIndex = sorted.findIndex((e) => e.id === myEntry.id);
  const neighbors = myIndex === -1 ? [] : sorted.slice(Math.max(0, myIndex - 2), myIndex + 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
          Your rank
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
          <div>
            <p className="text-2xl font-bold text-primary">#{myEntry.rank}</p>
            <p className="text-xs text-muted-foreground">out of {allEntries?.length ?? 0} students</p>
          </div>
          <p className="text-lg font-semibold text-foreground">{myEntry.totalPoints} pts</p>
        </div>

        {neighbors.length > 0 && (
          <div className="flex flex-col gap-1">
            {neighbors.map((entry, i) => {
              const isMe = entry.id === myEntry.id;
              const relativeIndex = myIndex - Math.max(0, myIndex - 2);
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                    isMe ? "border border-primary/40 bg-primary/5 font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {!isMe && i < relativeIndex && <ArrowUp className="h-3 w-3 text-success" aria-hidden="true" />}
                    {!isMe && i > relativeIndex && <ArrowDown className="h-3 w-3 text-destructive" aria-hidden="true" />}
                    <span>#{entry.rank}</span>
                    <span>{entry.studentName ?? entry.studentUsn ?? "Student"}</span>
                  </div>
                  <span>{entry.totalPoints} pts</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
