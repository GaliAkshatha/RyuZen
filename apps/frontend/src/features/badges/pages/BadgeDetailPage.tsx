import { useParams } from "react-router-dom";
import { Award } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

import { useBadge } from "@/features/badges/hooks/useBadge";
import { useUpdateBadge } from "@/features/badges/hooks/useUpdateBadge";
import { useAwardBadge } from "@/features/badges/hooks/useAwardBadge";
import { BadgeForm } from "@/features/badges/components/BadgeForm";
import { AwardBadgeForm } from "@/features/badges/components/AwardBadgeForm";
import { DeleteBadgeAction } from "@/features/badges/components/DeleteBadgeAction";
import { canAwardBadges, canManageBadgeCatalog } from "@/features/badges/utils/badgePermissions";

import { useStudents } from "@/features/students/hooks/useStudents";

export function BadgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: badge, isLoading, isError, error, refetch } = useBadge(id ?? "");
  const { data: students } = useStudents();
  const {
    mutate: updateBadge,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateBadge(id ?? "");
  const { mutate: awardBadge, isPending: isAwarding, error: awardError } = useAwardBadge(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !badge) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const canManageCatalog = canManageBadgeCatalog(user?.role);
  const canAward = canAwardBadges(user?.role);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-warning" aria-hidden="true" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">{badge.name}</h1>
            <p className="font-body text-sm text-muted-foreground">{badge.points} pts</p>
          </div>
        </div>
        {canManageCatalog && <DeleteBadgeAction badge={badge} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="font-body text-sm text-foreground">
            {badge.description || "No description provided."}
          </p>
          {badge.criteria && (
            <p className="font-body text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Criteria: </span>
              {badge.criteria}
            </p>
          )}
        </CardContent>
      </Card>

      {canAward && (
        <Card>
          <CardHeader>
            <CardTitle>Award to a Student</CardTitle>
          </CardHeader>
          <CardContent>
            <AwardBadgeForm
              studentOptions={students ?? []}
              isSubmitting={isAwarding}
              error={awardError}
              onSubmit={(values) =>
                awardBadge(values, { onSuccess: () => toast({ title: "Badge awarded" }) })
              }
            />
          </CardContent>
        </Card>
      )}

      {canManageCatalog && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeForm
              badge={badge}
              isSubmitting={isUpdating}
              error={updateError}
              onSubmit={(values) =>
                updateBadge(values, { onSuccess: () => toast({ title: "Badge updated" }) })
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
