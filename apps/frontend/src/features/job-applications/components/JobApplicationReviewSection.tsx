import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useToast } from "@/hooks/useToast";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";
import { JobApplicationStatus } from "@/types/enums";

import { useJobApplicationsForPlacement } from "@/features/job-applications/hooks/useJobApplicationsForPlacement";
import { useUpdateJobApplicationStatus } from "@/features/job-applications/hooks/useUpdateJobApplicationStatus";
import type { JobApplicationResponseDto } from "@/features/job-applications/types/jobApplication.types";

import { InterviewRoundsPanel } from "@/features/interview-rounds/components/InterviewRoundsPanel";

const STATUSES = [
  JobApplicationStatus.APPLIED,
  JobApplicationStatus.SHORTLISTED,
  JobApplicationStatus.REJECTED,
  JobApplicationStatus.SELECTED,
];

function ApplicationRow({
  application,
  placementId,
}: {
  application: JobApplicationResponseDto;
  placementId: string;
}) {
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateJobApplicationStatus(placementId);
  const [status, setStatus] = useState<JobApplicationStatus>(application.status);
  const [showRounds, setShowRounds] = useState(false);

  return (
    <li className="flex flex-col gap-2 rounded-md border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-body text-sm font-medium text-foreground">
              {application.studentName ?? application.studentId}
            </span>
            <StatusBadge status={application.status} />
          </div>
          {application.resume && (
            <a
              href={application.resume}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-body text-xs text-primary underline underline-offset-4"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              View resume
            </a>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Select value={status} onValueChange={(value) => setStatus(value as JobApplicationStatus)}>
            <SelectTrigger className="w-36" aria-label="Update status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {humanizeEnumValue(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            disabled={isPending || status === application.status}
            onClick={() =>
              mutate(
                { id: application.id, payload: { status } },
                { onSuccess: () => toast({ title: "Application status updated" }) },
              )
            }
          >
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="self-start"
        onClick={() => setShowRounds((v) => !v)}
      >
        {showRounds ? (
          <ChevronUp className="mr-1 h-3 w-3" aria-hidden="true" />
        ) : (
          <ChevronDown className="mr-1 h-3 w-3" aria-hidden="true" />
        )}
        Interview Rounds
      </Button>

      {showRounds && <InterviewRoundsPanel applicationId={application.id} />}
    </li>
  );
}

/** Embedded in PlacementDriveDetailPage, gated to canReviewJobApplications() (ORG_ADMIN-only). */
export function JobApplicationReviewSection({ placementId }: { placementId: string }) {
  const { data: applications } = useJobApplicationsForPlacement(placementId);

  if (!applications || applications.length === 0) {
    return (
      <p className="font-body text-sm text-muted-foreground">No applications submitted yet.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {applications.map((application) => (
        <ApplicationRow key={application.id} application={application} placementId={placementId} />
      ))}
    </ul>
  );
}
