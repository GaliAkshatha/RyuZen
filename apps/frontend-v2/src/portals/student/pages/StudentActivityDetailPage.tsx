import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useActivity } from "@/domains/activities/hooks/useActivity";
import { useMySubmissions } from "@/domains/submissions/hooks/useMySubmissions";
import { useCreateSubmission } from "@/domains/submissions/hooks/useCreateSubmission";
import { SubmitActivityForm } from "@/domains/submissions/components/SubmitActivityForm";
import type { CreateSubmissionFormValues } from "@/domains/submissions/submissionSchemas";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real submit flow, closing a previously-missing gap. Real
 * eligibility (department/batch, confirmed enforced server-side in
 * SubmissionEligibilityService) has no dedicated check-first
 * endpoint for activities the way Placement Drives now does - so an
 * ineligible student's submit attempt fails with the backend's own
 * real error message, shown honestly here, not hidden.
 */
export function StudentActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: activity, isLoading, isError, error, refetch } = useActivity(id ?? "");
  const { data: mySubmissions } = useMySubmissions();
  const { mutate: createSubmission, isPending } = useCreateSubmission();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

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

  const existingSubmission = mySubmissions?.find((s) => s.activityId === activity.id);

  function handleSubmit(values: CreateSubmissionFormValues) {
    setSubmitError(null);
    createSubmission({ ...values, activityId: activity!.id }, { onError: (err) => setSubmitError(err) });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{activity.title}</h1>
          <p className="text-sm text-muted-foreground">{activity.type}</p>
        </div>
        <span className="flex items-center gap-1.5 text-sm font-medium text-warning">
          <Star className="h-4 w-4" aria-hidden="true" />
          {activity.points} pts
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{activity.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {existingSubmission ? (
        <Card>
          <CardHeader>
            <CardTitle>Your submission</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <StatusBadge status={existingSubmission.status} />
            {existingSubmission.remarks && <p className="text-sm text-muted-foreground">{existingSubmission.remarks}</p>}
            {existingSubmission.review.feedback && (
              <p className="text-sm text-foreground">Feedback: {existingSubmission.review.feedback}</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit your work</CardTitle>
          </CardHeader>
          <CardContent>
            <SubmitActivityForm onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
