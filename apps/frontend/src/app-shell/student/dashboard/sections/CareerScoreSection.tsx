import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

import { LevelProgressRing } from "@/shared/components/LevelProgressRing";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";
import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";

/**
 * Compact, not full-width/enormous - a ring plus 2 short lines, sized
 * to sit correctly in the primary row alongside Focus and Upcoming.
 *
 * Freshness caveat is scoped precisely: only the leaderboard-derived
 * sub-score can lag (confirmed this session - GetCareerScoreUseCase
 * computes fresh every call, but reads LeaderboardEntry.totalPoints,
 * which is a manually-recalculated cache). The real
 * LeaderboardEntry.updatedAt timestamp is shown, not a fabricated
 * freshness percentage, and the caveat text is explicit that only
 * that one component is affected - not the whole score.
 */
export function CareerScoreSection() {
  const { data: score, isLoading: isLoadingScore, isError } = useCareerScore();
  const { data: entry } = useMyLeaderboardEntry();

  if (isLoadingScore) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card/60 p-4">
        <SkeletonLoader className="h-16 w-16 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (isError || !score) {
    return (
      <div className="rounded-lg border border-border bg-card/60 p-4">
        <p className="font-body text-sm text-muted-foreground">Career Score is unavailable right now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
        Career Score
      </div>
      <div className="flex items-center gap-4">
        <LevelProgressRing level={score.careerScore} progress={score.careerScore / 100} size={64} label="/ 100" />
        <div className="flex flex-col gap-1">
          <p className="font-body text-sm font-medium text-primary">{score.label}</p>
          <Link
            to="/app/ai/career-score"
            className="font-body text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            View full Career Score
          </Link>
        </div>
      </div>
      {entry?.updatedAt && (
        <p className="font-body text-[11px] text-muted-foreground">
          Activity score updated{" "}
          {new Date(entry.updatedAt).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
