import { Link } from "react-router-dom";
import { Gauge, TrendingUp, Target } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { LevelProgressRing } from "@/shared/components/LevelProgressRing";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

const SUB_SCORE_LABELS: Record<string, string> = {
  leaderboardScore: "Campus Activity",
  resumeScore: "Resume Quality",
  profileCompletenessScore: "Profile Completeness",
  achievementsScore: "Achievements",
};

/**
 * Real sub-scores already exist on CareerScoreResponseDto
 * (leaderboardScore, resumeScore, profileCompletenessScore,
 * achievementsScore) - "Top Strength" and "Focus Area" are the real
 * highest/lowest of those four, not fabricated labels. Deliberately
 * compact (ring + 2 short stat lines, not a sparse ring floating in a
 * large card) so this reads correctly in a 3-column row alongside
 * Today's Focus and Upcoming, matching the wireframe exactly, instead
 * of full-width with mostly empty space.
 */
export function CareerScoreWidget() {
  const { data: score, isLoading } = useCareerScore();

  const subScores = score
    ? [
        { key: "leaderboardScore", value: score.leaderboardScore },
        { key: "resumeScore", value: score.resumeScore },
        { key: "profileCompletenessScore", value: score.profileCompletenessScore },
        { key: "achievementsScore", value: score.achievementsScore },
      ].sort((a, b) => b.value - a.value)
    : [];

  const strongest = subScores[0];
  const weakest = subScores[subScores.length - 1];

  return (
    <WidgetCard title="Career Score" icon={Gauge} wired>
      {isLoading || !score ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <SkeletonLoader className="h-[72px] w-[72px] shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <SkeletonLoader className="h-4 w-24" />
              <SkeletonLoader className="h-3 w-20" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-border pt-2">
            <SkeletonLoader className="h-3 w-32" />
            <SkeletonLoader className="h-3 w-28" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <LevelProgressRing level={score.careerScore} progress={score.careerScore / 100} size={72} label="Score" />
            <div className="flex flex-col gap-1">
              <p className="font-body text-sm font-medium text-primary">
                {score.label}
                <span className="ml-1 font-normal text-muted-foreground">/ 100</span>
              </p>
              <Link
                to="/app/ai/career-score"
                className="font-body text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                View breakdown
              </Link>
            </div>
          </div>
          {strongest && weakest && (
            <div className="flex flex-col gap-1 border-t border-border pt-2">
              <p className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 shrink-0 text-success" aria-hidden="true" />
                Top strength: <span className="text-foreground">{SUB_SCORE_LABELS[strongest.key]}</span>
              </p>
              <p className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
                <Target className="h-3 w-3 shrink-0 text-warning" aria-hidden="true" />
                Focus area: <span className="text-foreground">{SUB_SCORE_LABELS[weakest.key]}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </WidgetCard>
  );
}
