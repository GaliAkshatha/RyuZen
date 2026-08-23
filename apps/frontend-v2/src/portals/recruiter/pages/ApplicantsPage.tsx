import { useNavigate } from "react-router-dom";
import { Users, Star, ArrowRight } from "lucide-react";

import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Button } from "@/shared/ui/Button";
import { useMyApplicants } from "@/domains/recruiters/hooks/useMyApplicants";
import { useUpdateApplicationStatus } from "@/domains/job-applications/hooks/useUpdateApplicationStatus";
import { JobApplicationStatus, type JobApplication } from "@/domains/job-applications/jobApplication.types";

const COLUMNS: { status: JobApplicationStatus; label: string; dot: string }[] = [
  { status: JobApplicationStatus.APPLIED, label: "Applied", dot: "bg-info" },
  { status: JobApplicationStatus.SHORTLISTED, label: "Shortlisted", dot: "bg-warning" },
  { status: JobApplicationStatus.SELECTED, label: "Selected", dot: "bg-success" },
  { status: JobApplicationStatus.REJECTED, label: "Rejected", dot: "bg-destructive" },
];

const NEXT_STAGE: Partial<Record<JobApplicationStatus, JobApplicationStatus>> = {
  [JobApplicationStatus.APPLIED]: JobApplicationStatus.SHORTLISTED,
  [JobApplicationStatus.SHORTLISTED]: JobApplicationStatus.SELECTED,
};

/**
 * Real kanban pipeline, per the approved wireframe - matches the
 * standard ATS pattern (Greenhouse/Lever) instead of a flat list.
 * Move actions are genuinely functional now that RECRUITER has real,
 * scoped access to PATCH /:id/status (this session's backend fix).
 * Clicking a card opens the real candidate profile, passing the
 * already-fetched, already-enriched application via router state
 * (GET /applications/:id is confirmed broken for RECRUITER, so this
 * avoids a second, failing fetch).
 */
export function ApplicantsPage() {
  const { data: applicants, isLoading, isError, error, refetch } = useMyApplicants();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (!applicants || applicants.length === 0) {
    return <EmptyState icon={Users} title="No applicants yet" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Applicants</h1>
        <p className="text-sm text-muted-foreground">Every applicant to your company's real drives.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const columnApplicants = applicants.filter((a) => a.status === col.status);
          return (
            <div key={col.status} className="flex flex-col gap-2 rounded-xl border border-border bg-card/40 p-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  {col.label}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{columnApplicants.length}</span>
              </div>

              <div className="flex flex-col gap-2">
                {columnApplicants.map((applicant) => (
                  <CandidateCard key={applicant.id} applicant={applicant} onOpen={() => navigate("/recruiter/candidates", { state: { applicant } })} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CandidateCard({ applicant, onOpen }: { applicant: JobApplication; onOpen: () => void }) {
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus(applicant.placementId);
  const nextStage = NEXT_STAGE[applicant.status];

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <button onClick={onOpen} className="w-full text-left">
        <p className="text-sm font-semibold text-foreground">{applicant.studentName ?? "Unknown"}</p>
        <p className="text-[11px] text-muted-foreground">{applicant.studentUsn}</p>
      </button>
      {nextStage && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          className="mt-2 flex w-full items-center justify-center gap-1.5 text-[11px]"
          onClick={() => updateStatus({ id: applicant.id, payload: { status: nextStage } })}
        >
          <Star className="h-3 w-3" aria-hidden="true" />
          Move forward
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
