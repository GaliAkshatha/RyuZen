import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

import { useLeaderboardEntry } from "@/features/leaderboard/hooks/useLeaderboardEntry";
import { useAdjustLeaderboardPoints } from "@/features/leaderboard/hooks/useAdjustLeaderboardPoints";
import { AdjustPointsForm } from "@/features/leaderboard/components/AdjustPointsForm";
import { canAdjustLeaderboard } from "@/features/leaderboard/utils/leaderboardPermissions";

import { useStudents } from "@/features/students/hooks/useStudents";
import { studentLabel, resolveStudentById } from "@/features/students/utils/studentLabels";

export function LeaderboardEntryDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: entry, isLoading, isError, error, refetch } = useLeaderboardEntry(studentId ?? "");
  const { data: students } = useStudents();
  const {
    mutate: adjustPoints,
    isPending,
    error: adjustError,
  } = useAdjustLeaderboardPoints(studentId ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !entry) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const student = resolveStudentById(students, entry.studentId);
  const canAdjust = canAdjustLeaderboard(user?.role);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          {student ? studentLabel(student) : entry.studentId}
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          Rank #{entry.rank} — {entry.totalPoints} total points
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Point Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 font-body text-sm">
            <div>
              <dt className="text-muted-foreground">Activity Points</dt>
              <dd className="font-display text-lg font-semibold text-foreground">
                {entry.activityPoints}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Event Points</dt>
              <dd className="font-display text-lg font-semibold text-foreground">
                {entry.eventPoints}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Club Points</dt>
              <dd className="font-display text-lg font-semibold text-foreground">
                {entry.clubPoints}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Placement Points</dt>
              <dd className="font-display text-lg font-semibold text-foreground">
                {entry.placementPoints}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {canAdjust && (
        <Card>
          <CardHeader>
            <CardTitle>Adjust Points</CardTitle>
          </CardHeader>
          <CardContent>
            <AdjustPointsForm
              entry={entry}
              isSubmitting={isPending}
              error={adjustError}
              onSubmit={(values) =>
                adjustPoints(values, { onSuccess: () => toast({ title: "Points adjusted" }) })
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
