import { useParams } from "react-router-dom";
import { Calendar, Coins } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Badge } from "@/shared/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

import { useActivity } from "@/features/activities/hooks/useActivity";
import { useUpdateActivity } from "@/features/activities/hooks/useUpdateActivity";
import { ActivityForm } from "@/features/activities/components/ActivityForm";
import { PublishActivityAction } from "@/features/activities/components/PublishActivityAction";
import { CloseActivityAction } from "@/features/activities/components/CloseActivityAction";
import { DeleteActivityAction } from "@/features/activities/components/DeleteActivityAction";
import { canManageActivities } from "@/features/activities/utils/activityPermissions";
import type { UpdateActivityFormValues } from "@/features/activities/schemas/activity.schemas";

import { SubmitActivitySection } from "@/features/submissions/components/SubmitActivitySection";

export function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: activity, isLoading, isError, error, refetch } = useActivity(id ?? "");
  const { mutate: updateActivity, isPending, error: updateError } = useUpdateActivity(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !activity) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const canManage = canManageActivities(user?.role);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-foreground">{activity.title}</h1>
          <div className="flex items-center gap-2">
            <StatusBadge status={activity.status} />
            <Badge variant="outline">{activity.type}</Badge>
            <Badge variant="outline">{activity.visibility}</Badge>
          </div>
          <div className="flex items-center gap-4 font-body text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Coins className="h-3.5 w-3.5" aria-hidden="true" />
              {activity.points} pts
              {activity.penaltyPoints > 0 ? ` (-${activity.penaltyPoints} penalty)` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {new Date(activity.startDate).toLocaleDateString()} –{" "}
              {new Date(activity.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-2">
            <PublishActivityAction activity={activity} />
            <CloseActivityAction activity={activity} />
            <DeleteActivityAction activity={activity} />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap font-body text-sm text-foreground">
            {activity.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      <SubmitActivitySection activity={activity} />

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityForm
              activity={activity}
              isSubmitting={isPending}
              error={updateError}
              onSubmit={(values) => {
                const { startDate, endDate, ...rest } = values as UpdateActivityFormValues;
                updateActivity(
                  {
                    ...rest,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                  },
                  { onSuccess: () => toast({ title: "Activity updated" }) },
                );
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
