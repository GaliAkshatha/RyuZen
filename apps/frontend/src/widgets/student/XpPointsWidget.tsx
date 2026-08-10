import { Link } from "react-router-dom";
import { Trophy, TrendingUp } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { LevelProgressRing } from "@/shared/components/LevelProgressRing";
import { computeLevelProgress } from "@/utils/xpLevel";

import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";

/**
 * Wired in C4, using GET /leaderboard/me — a genuine STUDENT-only
 * self-service endpoint (unlike the gaps found in C2/C3/A4), confirmed
 * this milestone.
 *
 * Level/progress ring is a purely presentational derivation of the
 * same real `totalPoints` value (see utils/xpLevel.ts) — no new data,
 * just a more motivating read of the number that was always here.
 */
export function XpPointsWidget() {
  const { data: entry, isLoading } = useMyLeaderboardEntry();

  const progress = entry ? computeLevelProgress(entry.totalPoints) : null;

  return (
    <WidgetCard title="XP / Points" icon={Trophy} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : !entry || !progress ? (
        <p className="font-body text-sm text-muted-foreground">
          No points yet — complete an activity to start earning XP.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <LevelProgressRing level={progress.level} progress={progress.progress} size={72} />
          <div className="flex flex-col gap-1">
            <Link to="/app/point-history" className="group w-fit">
              <p className="font-display text-2xl font-bold leading-none text-foreground group-hover:text-primary">
                {entry.totalPoints.toLocaleString()}
                <span className="ml-1 font-body text-sm font-normal text-muted-foreground">
                  pts
                </span>
              </p>
            </Link>
            <p className="flex items-center gap-1 font-body text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" aria-hidden="true" />
              Rank #{entry.rank}
            </p>
            <p className="font-body text-xs text-muted-foreground">
              {progress.pointsForNextLevel - progress.pointsIntoLevel} XP to Level{" "}
              {progress.level + 1}
            </p>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
