import { useState } from "react";
import { Medal, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { AchievementStatus } from "@/types/enums";

import { useMyAchievements } from "@/features/achievements/hooks/useMyAchievements";
import { useCreateAchievement } from "@/features/achievements/hooks/useCreateAchievement";
import { useUpdateAchievement } from "@/features/achievements/hooks/useUpdateAchievement";
import { AchievementForm } from "@/features/achievements/components/AchievementForm";
import { DeleteAchievementAction } from "@/features/achievements/components/DeleteAchievementAction";
import type { AchievementResponseDto } from "@/features/achievements/types/achievement.types";
import type {
  CreateAchievementFormValues,
  UpdateAchievementFormValues,
} from "@/features/achievements/schemas/achievement.schemas";

function AchievementRow({ achievement }: { achievement: AchievementResponseDto }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const { mutate: updateAchievement, isPending, error } = useUpdateAchievement(achievement.id);

  if (editing) {
    return (
      <li className="rounded-md border border-border p-3">
        <AchievementForm
          achievement={achievement}
          isSubmitting={isPending}
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={(values) => {
            const { achievementDate, ...rest } = values as UpdateAchievementFormValues;
            updateAchievement(
              { ...rest, achievementDate: achievementDate?.toISOString() },
              {
                onSuccess: () => {
                  toast({ title: "Achievement updated" });
                  setEditing(false);
                },
              },
            );
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-2 rounded-md border border-border p-3">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
          {achievement.title}
          <StatusBadge status={achievement.status} />
        </span>
        <span className="font-body text-xs text-muted-foreground">
          {new Date(achievement.achievementDate).toLocaleDateString()}
          {achievement.level ? ` · ${achievement.level}` : ""}
          {achievement.position ? ` · ${achievement.position}` : ""}
        </span>
        {achievement.description && (
          <p className="font-body text-sm text-foreground">{achievement.description}</p>
        )}
        <div className="flex gap-2">
          {achievement.certificateUrl && (
            <a
              href={achievement.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-body text-xs text-primary underline underline-offset-4"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              Certificate
            </a>
          )}
          {achievement.proofUrl && (
            <a
              href={achievement.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-body text-xs text-primary underline underline-offset-4"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              Proof
            </a>
          )}
        </div>
        {achievement.category && <Badge variant="outline">{achievement.category}</Badge>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DeleteAchievementAction achievementId={achievement.id} />
      </div>
    </li>
  );
}

export function AchievementListPage() {
  const { data: achievements, isLoading, isError, error, refetch } = useMyAchievements();
  const {
    mutate: createAchievement,
    isPending: isCreating,
    error: createError,
  } = useCreateAchievement();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const pendingCount = (achievements ?? []).filter(
    (a) => a.status === AchievementStatus.PENDING,
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Medal className="h-6 w-6 text-warning" aria-hidden="true" />
          My Achievements
        </h1>
        {pendingCount > 0 && (
          <p className="mt-1 font-body text-sm text-muted-foreground">
            {pendingCount} awaiting review.
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit an Achievement</CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm ? (
            <AchievementForm
              isSubmitting={isCreating}
              error={createError}
              onCancel={() => setShowAddForm(false)}
              onSubmit={(values) => {
                const { achievementDate, ...rest } = values as CreateAchievementFormValues;
                createAchievement(
                  { ...rest, achievementDate: achievementDate.toISOString() },
                  {
                    onSuccess: () => {
                      toast({ title: "Achievement submitted for review" });
                      setShowAddForm(false);
                    },
                  },
                );
              }}
            />
          ) : (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              Submit achievement
            </Button>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-24" />
          ))}
        </div>
      ) : !achievements || achievements.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          description="Submit your accomplishments for faculty review."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {achievements.map((achievement) => (
            <AchievementRow key={achievement.id} achievement={achievement} />
          ))}
        </ul>
      )}
    </div>
  );
}
