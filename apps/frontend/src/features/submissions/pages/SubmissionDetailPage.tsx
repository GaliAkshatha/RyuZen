import { useParams, Link } from "react-router-dom";
import { ExternalLink, PartyPopper } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { SubmissionStatus } from "@/types/enums";

import { useSubmission } from "@/features/submissions/hooks/useSubmission";
import { useApproveSubmission } from "@/features/submissions/hooks/useApproveSubmission";
import { useRejectSubmission } from "@/features/submissions/hooks/useRejectSubmission";
import { useResubmitSubmission } from "@/features/submissions/hooks/useResubmitSubmission";
import { ApproveSubmissionForm } from "@/features/submissions/components/ApproveSubmissionForm";
import { RejectSubmissionForm } from "@/features/submissions/components/RejectSubmissionForm";
import { ResubmitForm } from "@/features/submissions/components/ResubmitForm";
import { canReviewSubmissions } from "@/features/submissions/utils/submissionPermissions";

import { useActivity } from "@/features/activities/hooks/useActivity";

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: submission, isLoading, isError, error, refetch } = useSubmission(id ?? "");
  const { data: activity } = useActivity(submission?.activityId ?? "");
  const {
    mutate: approve,
    isPending: isApproving,
    error: approveError,
  } = useApproveSubmission(id ?? "");
  const {
    mutate: reject,
    isPending: isRejecting,
    error: rejectError,
  } = useRejectSubmission(id ?? "");
  const {
    mutate: resubmit,
    isPending: isResubmitting,
    error: resubmitError,
  } = useResubmitSubmission(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !submission) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const isOwner = user?.id === submission.submittedBy;
  const canReview = canReviewSubmissions(user?.role);
  const needsReview =
    submission.status === SubmissionStatus.PENDING ||
    submission.status === SubmissionStatus.RESUBMITTED;

  return (
    <div className="relative mx-auto flex max-w-xl flex-col gap-6">
      <PageAtmosphere variant="particles" />

      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          {activity?.title ?? "Submission"}
        </h1>
        <StatusBadge status={submission.status} className="mt-1" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="font-body text-sm text-foreground">
            {submission.remarks || "No remarks provided."}
          </p>
          <div className="flex flex-col gap-1">
            {submission.attachments.map((attachment, i) => (
              <a
                key={i}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-body text-sm text-primary underline underline-offset-4"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                {attachment.name}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {submission.review.reviewedAt && submission.status === SubmissionStatus.APPROVED && (
        <Card className="overflow-hidden border-success/30 bg-gradient-to-br from-success/10 via-card to-card shadow-[0_0_32px_-12px_hsl(var(--success)/0.4)]">
          <CardContent className="flex items-center gap-4 py-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-success/30">
              <PartyPopper className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="font-display text-lg font-bold text-foreground">Approved!</p>
              <p className="font-body text-sm text-success">
                +{submission.review.pointsAwarded} XP added to your total
              </p>
              {submission.review.feedback && (
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  {submission.review.feedback}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {submission.review.reviewedAt && submission.status !== SubmissionStatus.APPROVED && (
        <Card>
          <CardHeader>
            <CardTitle>Review</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="font-body text-sm text-foreground">{submission.review.feedback}</p>
            <p className="font-body text-sm text-muted-foreground">
              Points awarded: {submission.review.pointsAwarded}
            </p>
          </CardContent>
        </Card>
      )}

      {canReview && needsReview && (
        <Card>
          <CardHeader>
            <CardTitle>Review this submission</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ApproveSubmissionForm
              suggestedPoints={activity?.points ?? 0}
              isSubmitting={isApproving}
              error={approveError}
              onSubmit={(values) =>
                approve(values, { onSuccess: () => toast({ title: "Submission approved" }) })
              }
            />
            <RejectSubmissionForm
              isSubmitting={isRejecting}
              error={rejectError}
              onSubmit={(values) =>
                reject(values, { onSuccess: () => toast({ title: "Submission rejected" }) })
              }
            />
          </CardContent>
        </Card>
      )}

      {isOwner && submission.status === SubmissionStatus.REJECTED && (
        <Card>
          <CardHeader>
            <CardTitle>Resubmit</CardTitle>
          </CardHeader>
          <CardContent>
            <ResubmitForm
              isSubmitting={isResubmitting}
              error={resubmitError}
              onSubmit={(values) =>
                resubmit(values, { onSuccess: () => toast({ title: "Resubmitted for review" }) })
              }
            />
          </CardContent>
        </Card>
      )}

      {activity && (
        <Link
          to={`/app/activities/${activity.id}`}
          className="font-body text-sm text-muted-foreground hover:text-foreground"
        >
          View activity
        </Link>
      )}
    </div>
  );
}
