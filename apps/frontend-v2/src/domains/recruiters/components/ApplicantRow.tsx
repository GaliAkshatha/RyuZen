import { useState } from "react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { InterviewRoundsPanel } from "@/domains/interview-rounds/components/InterviewRoundsPanel";
import type { JobApplication } from "@/domains/job-applications/jobApplication.types";

export function ApplicantRow({ applicant }: { applicant: JobApplication }) {
  const [showRounds, setShowRounds] = useState(false);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{applicant.studentName ?? applicant.studentId}</p>
            {applicant.studentUsn && <p className="text-xs text-muted-foreground">{applicant.studentUsn}</p>}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={applicant.status} />
            <Button size="sm" variant="outline" onClick={() => setShowRounds((v) => !v)}>
              {showRounds ? "Hide interviews" : "Interviews"}
            </Button>
          </div>
        </div>
        {showRounds && <InterviewRoundsPanel applicationId={applicant.id} />}
      </CardContent>
    </Card>
  );
}
