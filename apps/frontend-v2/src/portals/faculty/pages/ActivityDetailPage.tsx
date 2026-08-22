import { useParams, useNavigate } from "react-router-dom";
import { Send, Lock, Trash2, ClipboardList, Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { StatCard } from "@/shared/components/StatCard";
import { useActivity } from "@/domains/activities/hooks/useActivity";
import { usePublishActivity } from "@/domains/activities/hooks/usePublishActivity";
import { useCloseActivity } from "@/domains/activities/hooks/useCloseActivity";
import { useDeleteActivity } from "@/domains/activities/hooks/useDeleteActivity";
import { useSubmissionsForActivity } from "@/domains/submissions/hooks/useSubmissionsForActivity";
import { SubmissionReviewRow } from "@/domains/submissions/components/SubmissionReviewRow";
import { ActivityStatus } from "@/domains/activities/activity.types";
import { SubmissionStatus } from "@/domains/submissions/submission.types";

export function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: activity, isLoading, isError, error, refetch } = useActivity(id ?? "");
  const { data: submissions, isLoading: isLoadingSubmissions } = useSubmissionsForActivity(id ?? "");
  const { mutate: publishActivity, isPending: isPublishing } = usePublishActivity();
  const { mutate: closeActivity, isPending: isClosing } = useCloseActivity();
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !activity) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const pending = (submissions ?? []).filter((s) => s.status === SubmissionStatus.PENDING).length;
  const approved = (submissions ?? []).filter((s) => s.status === SubmissionStatus.APPROVED).length;
  const rejected = (submissions ?? []).filter((s) => s.status === SubmissionStatus.REJECTED).length;

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit flex items-center gap-1.5 text-muted-foreground"
        onClick={() => navigate("/faculty/activities")}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to activities
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{activity.title}</h1>
          <p className="text-sm text-muted-foreground">
            {activity.type} · {activity.points} pts · Due {new Date(activity.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={activity.status} />
          {activity.status === ActivityStatus.DRAFT && (
            <Button
              size="sm"
              disabled={isPublishing}
              className="flex items-center gap-2"
              onClick={() => publishActivity(activity.id)}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Publish
            </Button>
          )}
          {activity.status === ActivityStatus.PUBLISHED && (
            <Button
              size="sm"
              variant="outline"
              disabled={isClosing}
              className="flex items-center gap-2"
              onClick={() => closeActivity(activity.id)}
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Close
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={isDeleting}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
            onClick={() => {
              if (window.confirm(`Delete "${activity.title}"? This cannot be undone.`)) {
                deleteActivity(activity.id, { onSuccess: () => navigate("/faculty/activities") });
              }
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{activity.description || "No description."}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Submissions</h2>

        {submissions && submissions.length > 0 && (
          <div className="mb-4 grid grid-cols-4 gap-3">
            <StatCard icon={ClipboardList} value={submissions.length} label="Total" tone="primary" />
            <StatCard icon={Clock} value={pending} label="Pending" tone="warning" />
            <StatCard icon={CheckCircle2} value={approved} label="Approved" tone="success" />
            <StatCard icon={XCircle} value={rejected} label="Rejected" tone="destructive" />
          </div>
        )}
        {isLoadingSubmissions ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <EmptyState title="No submissions yet" description="Submissions will appear here once students submit." />
        ) : (
          <div className="flex flex-col gap-3">
            {submissions.map((s) => (
              <SubmissionReviewRow key={s.id} submission={s} activityId={activity.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
