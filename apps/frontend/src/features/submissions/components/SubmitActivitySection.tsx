import { Link } from "react-router-dom";
import { PartyPopper } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { ActivityStatus, SubmissionStatus } from "@/types/enums";

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
 *
 * An APPROVED submission gets a genuinely celebratory treatment
 * (glow border, points-awarded front and center) rather than the same
 * neutral badge as every other status — this is the actual reward
 * moment the whole XP system points toward, so it should look like one.
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

  if (existing?.status === SubmissionStatus.APPROVED) {
    return (
      <Card className="overflow-hidden border-success/30 bg-gradient-to-br from-success/10 via-card to-card shadow-[0_0_32px_-12px_hsl(var(--success)/0.4)]">
        <CardContent className="flex items-center gap-4 py-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-success/30">
            <PartyPopper className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-lg font-bold text-foreground">Submission approved!</p>
            <p className="font-body text-sm text-success">
              +{existing.review.pointsAwarded} XP added to your total
            </p>
            <Link
              to={`/app/submissions/${existing.id}`}
              className="mt-1 font-body text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              View submission
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

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
