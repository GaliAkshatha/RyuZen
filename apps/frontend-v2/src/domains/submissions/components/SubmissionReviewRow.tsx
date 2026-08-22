import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X, ChevronDown, ChevronUp, Paperclip, ExternalLink } from "lucide-react";

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

/**
 * Real two-step review: the submission's actual content (remarks +
 * every real attachment, as clickable links) is shown BEFORE the
 * approve/reject decision, not just two buttons with nothing to
 * review - a real, confirmed gap this pass. Pending submissions start
 * expanded (there's something to genuinely act on); already-reviewed
 * ones start collapsed but can still be opened to re-check what was
 * submitted. The student's real name (server-enriched this pass,
 * closing a second real gap) replaces what used to be a raw user id.
 */
export function SubmissionReviewRow({ submission, activityId }: { submission: Submission; activityId: string }) {
  const isPending = submission.status === SubmissionStatus.PENDING;
  const [expanded, setExpanded] = useState(isPending);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const { mutate: approve, isPending: isApproving } = useApproveSubmission(activityId);
  const { mutate: reject, isPending: isRejecting } = useRejectSubmission(activityId);

  const approveForm = useForm<ApproveSubmissionFormValues>({ resolver: zodResolver(approveSubmissionSchema) });
  const rejectForm = useForm<RejectSubmissionFormValues>({ resolver: zodResolver(rejectSubmissionSchema) });

  return (
    <div className="rounded-lg border border-border">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="font-medium text-foreground">{submission.submittedByName ?? "Unknown student"}</p>
          {submission.submittedByUsn && <p className="text-xs text-muted-foreground">{submission.submittedByUsn}</p>}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={submission.status} />
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border p-4">
          {submission.remarks && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Remarks from student</p>
              <p className="text-sm text-foreground">{submission.remarks}</p>
            </div>
          )}

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              Attachments ({submission.attachments.length})
            </p>
            {submission.attachments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No attachments.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {submission.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {att.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {!isPending && submission.review.feedback && (
            <div className="rounded-md bg-muted/50 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Your feedback</p>
              <p className="text-sm text-foreground">{submission.review.feedback}</p>
              {submission.status === SubmissionStatus.APPROVED && (
                <p className="mt-1 text-xs text-success">{submission.review.pointsAwarded} points awarded</p>
              )}
            </div>
          )}

          {isPending && (
            <div className="border-t border-border pt-3">
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
                    approve({ submissionId: submission.id, payload: values }, { onSuccess: () => setAction(null) });
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
                    reject({ submissionId: submission.id, payload: values }, { onSuccess: () => setAction(null) });
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
