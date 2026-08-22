import { Lightbulb, Map } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { useCareerScore } from "@/domains/career-score/hooks/useCareerScore";

const SUB_SCORES = [
  { key: "leaderboardScore" as const, label: "Activity Points" },
  { key: "resumeScore" as const, label: "Resume (ATS)" },
  { key: "profileCompletenessScore" as const, label: "Profile Completeness" },
  { key: "achievementsScore" as const, label: "Achievements" },
];

/**
 * A known, honest limitation carried over from earlier verification
 * of this backend: Leaderboard (which feeds leaderboardScore) is a
 * cached aggregate that only updates when manually recalculated, not
 * automatically on every point-earning action - so this one sub-score
 * can genuinely lag behind a student's most recent activity. Building
 * a real "as of" timestamp for it would require the separate
 * Leaderboard domain (GET /leaderboard/me, LeaderboardEntry.updatedAt)
 * which isn't built yet in this rebuild - noted as a static caveat
 * here rather than silently omitted or half-implemented with a fake
 * timestamp.
 */
export function CareerScorePage() {
  const { data: careerScore, isLoading, isError, error, refetch } = useCareerScore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !careerScore) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Career Score</h1>
      </div>

      <Card>
        <CardContent className="flex items-center gap-6 py-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-primary">
            <span className="text-3xl font-bold text-foreground">{careerScore.careerScore}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{careerScore.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{careerScore.narrative}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SUB_SCORES.map((sub) => (
            <div key={sub.key}>
              <p className="text-2xl font-bold text-foreground">{careerScore[sub.key]}</p>
              <p className="text-xs text-muted-foreground">{sub.label}</p>
              {sub.key === "leaderboardScore" && (
                <p className="mt-0.5 text-[10px] text-muted-foreground/70">May lag your most recent activity</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {careerScore.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {careerScore.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-foreground">
                  · {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {careerScore.roadmap.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Map className="h-4 w-4 text-primary" aria-hidden="true" />
              Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-2">
              {careerScore.roadmap.map((step, i) => (
                <li key={i} className="text-sm text-foreground">
                  {i + 1}. {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
