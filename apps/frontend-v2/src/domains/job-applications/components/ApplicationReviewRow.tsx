import { Card, CardContent } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useUpdateApplicationStatus } from "@/domains/job-applications/hooks/useUpdateApplicationStatus";
import { JobApplicationStatus, type JobApplication } from "@/domains/job-applications/jobApplication.types";

const NEXT_STATUS_OPTIONS: Record<string, { status: JobApplicationStatus; label: string; variant: "default" | "outline" | "destructive" }[]> = {
  [JobApplicationStatus.APPLIED]: [
    { status: JobApplicationStatus.SHORTLISTED, label: "Shortlist", variant: "default" },
    { status: JobApplicationStatus.REJECTED, label: "Reject", variant: "outline" },
  ],
  [JobApplicationStatus.SHORTLISTED]: [
    { status: JobApplicationStatus.SELECTED, label: "Select", variant: "default" },
    { status: JobApplicationStatus.REJECTED, label: "Reject", variant: "outline" },
  ],
};

export function ApplicationReviewRow({ application, placementId }: { application: JobApplication; placementId: string }) {
  const { mutate: updateStatus, isPending, variables } = useUpdateApplicationStatus(placementId);

  const nextOptions = NEXT_STATUS_OPTIONS[application.status] ?? [];

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-3">
        <div>
          <p className="font-medium text-foreground">{application.studentName ?? application.studentId}</p>
          {application.studentUsn && <p className="text-xs text-muted-foreground">{application.studentUsn}</p>}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={application.status} />
          {nextOptions.map((option) => {
            const isThis = isPending && variables?.payload.status === option.status && variables?.id === application.id;
            return (
              <Button
                key={option.status}
                size="sm"
                variant={option.variant}
                disabled={isPending}
                onClick={() => updateStatus({ id: application.id, payload: { status: option.status } })}
              >
                {isThis ? "Saving…" : option.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
