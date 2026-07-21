import { Trophy } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";

/**
 * Wired in C4, using GET /leaderboard/me — a genuine STUDENT-only
 * self-service endpoint (unlike the gaps found in C2/C3/A4), confirmed
 * this milestone.
 */
export function XpPointsWidget() {
  const { data: entry, isLoading } = useMyLeaderboardEntry();

  return (
    <WidgetCard title="XP / Points" icon={Trophy} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : !entry ? (
        <p className="font-body text-sm text-muted-foreground">No points yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="font-display text-2xl font-semibold text-foreground">
            {entry.totalPoints} pts
          </p>
          <p className="font-body text-sm text-muted-foreground">Rank #{entry.rank}</p>
        </div>
      )}
    </WidgetCard>
  );
}
