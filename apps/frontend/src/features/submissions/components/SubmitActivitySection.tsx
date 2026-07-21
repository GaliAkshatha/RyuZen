import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { ActivityStatus } from "@/types/enums";

import { useSubmissions } from "@/features/submissions/hooks/useSubmissions";
import { useSubmitActivity } from "@/features/submissions/hooks/useSubmitActivity";
import { SubmitActivityForm } from "@/features/submissions/components/SubmitActivityForm";
import type { ActivityResponseDto } from "@/features/activities/types/activity.types";

/**
 * Mirrors SubmissionEligibilityService's real rules for UX purposes
 * (published, not past the deadline, no existing submission) —
 * confirmed against the backend this milestone. The backend still
 * enforces these independently; this only avoids showing a form the
 * server would reject.
 */
export function SubmitActivitySection({ activity }: { activity: ActivityResponseDto }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: mySubmissions, isLoading } = useSubmissions(
    user ? { activityId: activity.id, submittedBy: user.id } : undefined,
  );
  const { mutate, isPending, error } = useSubmitActivity();

  if (isLoading) return null;

  const existing = mySubmissions?.[0];

  if (existing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Submission</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <StatusBadge status={existing.status} />
          <Link
            to={`/app/submissions/${existing.id}`}
            className="font-body text-sm text-primary underline underline-offset-4"
          >
            View submission
          </Link>
        </CardContent>
      </Card>
    );
  }

  const isPublished = activity.status === ActivityStatus.PUBLISHED;
  const isPastDeadline = new Date(activity.endDate) < new Date();

  if (!isPublished || isPastDeadline) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-sm text-muted-foreground">
            {!isPublished
              ? "This activity is not yet published."
              : "The submission deadline for this activity has passed."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit</CardTitle>
      </CardHeader>
      <CardContent>
        <SubmitActivityForm
          activityId={activity.id}
          isSubmitting={isPending}
          error={error}
          onSubmit={(values) =>
            mutate(values, { onSuccess: () => toast({ title: "Submitted for review" }) })
          }
        />
      </CardContent>
    </Card>
  );
}
