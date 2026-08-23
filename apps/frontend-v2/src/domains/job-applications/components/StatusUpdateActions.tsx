import { X, ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useUpdateApplicationStatus } from "@/domains/job-applications/hooks/useUpdateApplicationStatus";
import { JobApplicationStatus, type JobApplicationStatus as Status } from "@/domains/job-applications/jobApplication.types";

const NEXT_STAGE: Partial<Record<Status, Status>> = {
  [JobApplicationStatus.APPLIED]: JobApplicationStatus.SHORTLISTED,
  [JobApplicationStatus.SHORTLISTED]: JobApplicationStatus.SELECTED,
};

const NEXT_LABEL: Partial<Record<Status, string>> = {
  [JobApplicationStatus.APPLIED]: "Shortlist",
  [JobApplicationStatus.SHORTLISTED]: "Select",
};

/**
 * Real stage-transition actions - genuinely actionable now that
 * RECRUITER has real, scoped access to PATCH /:id/status (this
 * session's earlier backend fix: a recruiter can only move
 * applications for their own company's real drives, enforced
 * server-side on every call).
 */
export function StatusUpdateActions({
  applicationId,
  placementId,
  currentStatus,
}: {
  applicationId: string;
  placementId: string;
  currentStatus: Status;
}) {
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus(placementId);

  const nextStage = NEXT_STAGE[currentStatus];
  const isFinal = currentStatus === JobApplicationStatus.SELECTED || currentStatus === JobApplicationStatus.REJECTED;

  if (isFinal) return null;

  return (
    <div className="flex gap-2">
      {nextStage && (
        <Button
          size="sm"
          disabled={isPending}
          className="flex items-center gap-1.5"
          onClick={() => updateStatus({ id: applicationId, payload: { status: nextStage } })}
        >
          {NEXT_LABEL[currentStatus]}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        className="flex items-center gap-1.5 text-destructive hover:text-destructive"
        onClick={() => updateStatus({ id: applicationId, payload: { status: JobApplicationStatus.REJECTED } })}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
        Reject
      </Button>
    </div>
  );
}
