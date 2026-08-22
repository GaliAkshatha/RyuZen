import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useApproveSubmission } from "@/domains/submissions/hooks/useApproveSubmission";
import { useRejectSubmission } from "@/domains/submissions/hooks/useRejectSubmission";
import {
  approveSubmissionSchema,
  rejectSubmissionSchema,
  type ApproveSubmissionFormValues,
  type RejectSubmissionFormValues,
} from "@/domains/activities/activitySchemas";
import type { Submission } from "@/domains/submissions/submission.types";
import { SubmissionStatus } from "@/domains/submissions/submission.types";

export function SubmissionReviewRow({ submission, activityId }: { submission: Submission; activityId: string }) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const { mutate: approve, isPending: isApproving } = useApproveSubmission(activityId);
  const { mutate: reject, isPending: isRejecting } = useRejectSubmission(activityId);

  const approveForm = useForm<ApproveSubmissionFormValues>({ resolver: zodResolver(approveSubmissionSchema) });
  const rejectForm = useForm<RejectSubmissionFormValues>({ resolver: zodResolver(rejectSubmissionSchema) });

  const isPending = submission.status === SubmissionStatus.PENDING;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">{submission.submittedBy}</p>
        <StatusBadge status={submission.status} />
      </div>

      {submission.remarks && <p className="text-sm text-foreground">{submission.remarks}</p>}

      {!isPending && submission.review.feedback && (
        <p className="text-xs text-muted-foreground">Feedback: {submission.review.feedback}</p>
      )}

      {isPending && (
        <>
          {action === null && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setAction("approve")} className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => setAction("reject")} className="flex items-center gap-1">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Reject
              </Button>
            </div>
          )}

          {action === "approve" && (
            <form
              className="flex flex-col gap-2"
              onSubmit={approveForm.handleSubmit((values) => {
                approve(
                  { submissionId: submission.id, payload: values },
                  { onSuccess: () => setAction(null) },
                );
              })}
            >
              <Input placeholder="Feedback" {...approveForm.register("feedback")} />
              {approveForm.formState.errors.feedback && (
                <p className="text-xs text-destructive">{approveForm.formState.errors.feedback.message}</p>
              )}
              <Input type="number" min={0} placeholder="Points to award" {...approveForm.register("pointsAwarded")} />
              {approveForm.formState.errors.pointsAwarded && (
                <p className="text-xs text-destructive">{approveForm.formState.errors.pointsAwarded.message}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isApproving}>
                  {isApproving ? "Approving…" : "Confirm approval"}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setAction(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {action === "reject" && (
            <form
              className="flex flex-col gap-2"
              onSubmit={rejectForm.handleSubmit((values) => {
                reject(
                  { submissionId: submission.id, payload: values },
                  { onSuccess: () => setAction(null) },
                );
              })}
            >
              <Input placeholder="Reason for rejection" {...rejectForm.register("feedback")} />
              {rejectForm.formState.errors.feedback && (
                <p className="text-xs text-destructive">{rejectForm.formState.errors.feedback.message}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" size="sm" variant="destructive" disabled={isRejecting}>
                  {isRejecting ? "Rejecting…" : "Confirm rejection"}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setAction(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
