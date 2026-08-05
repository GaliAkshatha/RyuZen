import { useParams } from "react-router-dom";
import { BarChart3 } from "lucide-react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { useAssessmentResults } from "@/features/assessments/hooks/useAssessmentResults";
import type { AssessmentAttemptResponseDto } from "@/features/assessments/types/assessment.types";

export function AssessmentResultsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { data: results, isLoading, isError, error, refetch } = useAssessmentResults(assessmentId!);

  const columns: DataGridColumn<AssessmentAttemptResponseDto>[] = [
    { key: "studentId", header: "Student", render: (a) => a.studentId },
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
        <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
        Results
      </h1>

      <DataGrid
        data={results ?? []}
        columns={columns}
        getRowId={(a) => a.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by student…"
        getSearchableText={(a) => a.studentId}
        emptyTitle="No attempts yet"
        emptyDescription="Real results will appear here once students attempt this assessment."
      />
    </div>
  );
}
