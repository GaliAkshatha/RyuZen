import { Gauge, Info, Trophy, FileText, UserCheck, Medal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatCard } from "@/shared/components/StatCard";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

export function CareerScorePage() {
  const { data: score, isLoading, isError, error, refetch } = useCareerScore();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Gauge className="h-6 w-6 text-primary" aria-hidden="true" />
        Career Score
      </h1>

      {isLoading || !score ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <p className="font-display text-6xl font-semibold text-foreground">
                {score.careerScore}
              </p>
              <p className="font-body text-sm text-muted-foreground">out of 100</p>
              <p className="font-display text-lg font-medium text-primary">{score.label}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Leaderboard" value={score.leaderboardScore} icon={Trophy} />
            <StatCard label="Resume" value={score.resumeScore} icon={FileText} />
            <StatCard
              label="Profile Completeness"
              value={score.profileCompletenessScore}
              icon={UserCheck}
            />
            <StatCard label="Achievements" value={score.achievementsScore} icon={Medal} />
          </div>

          <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 font-body text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              The score and label above are computed deterministically from your real Leaderboard
              standing, Resume score, profile completeness, and verified achievements. The written
              narrative below is placeholder text, not AI-generated — no live language-model
              provider is configured yet.
            </span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Narrative</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm text-muted-foreground">{score.narrative}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
