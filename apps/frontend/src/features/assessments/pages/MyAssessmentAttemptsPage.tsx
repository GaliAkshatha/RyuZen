import { GraduationCap } from "lucide-react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { useMyAssessmentAttempts } from "@/features/assessments/hooks/useMyAssessmentAttempts";
import type { AssessmentAttemptResponseDto } from "@/features/assessments/types/assessment.types";

export function MyAssessmentAttemptsPage() {
  const { data: attempts, isLoading, isError, error, refetch } = useMyAssessmentAttempts();

  const columns: DataGridColumn<AssessmentAttemptResponseDto>[] = [
    { key: "assessmentId", header: "Assessment", render: (a) => a.assessmentId },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "score", header: "Score", render: (a) => a.score ?? "—" },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (a) => (a.submittedAt ? new Date(a.submittedAt).toLocaleString() : "—"),
    },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
        My Attempts
      </h1>

      <DataGrid
        data={attempts ?? []}
        columns={columns}
        getRowId={(a) => a.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search…"
        getSearchableText={(a) => a.assessmentId}
        emptyTitle="No attempts yet"
        emptyDescription="Assessments you've taken will appear here."
      />
    </div>
  );
}
