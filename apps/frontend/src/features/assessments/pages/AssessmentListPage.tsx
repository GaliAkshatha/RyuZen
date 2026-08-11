import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/ui/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

import { useAssessments } from "@/features/assessments/hooks/useAssessments";
import { AcademicLayout } from "@/features/academic-hub/components/AcademicLayout";
import type { AssessmentResponseDto } from "@/features/assessments/types/assessment.types";

export function AssessmentListPage() {
  const { user } = useAuth();
  const isFaculty = user?.role === UserRole.FACULTY || user?.role === UserRole.ORG_ADMIN;

  const { data: assessments, isLoading, isError, error, refetch } = useAssessments();

  const columns: DataGridColumn<AssessmentResponseDto>[] = [
    { key: "title", header: "Title", render: (a) => a.title },
    { key: "type", header: "Type", render: (a) => a.type.replace(/_/g, " ") },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "durationMinutes", header: "Duration", render: (a) => `${a.durationMinutes} min` },
    { key: "totalMarks", header: "Marks", render: (a) => a.totalMarks || "—" },
    {
      key: "actions",
      header: "",
      render: (a) =>
        isFaculty ? (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/app/assessments/${a.id}/manage`}>Manage</Link>
          </Button>
        ) : a.status === "PUBLISHED" ? (
          <Button size="sm" asChild>
            <Link to={`/app/assessments/${a.id}/take`}>Start</Link>
          </Button>
        ) : null,
    },
  ];

  if (isError) {
    return (
      <AcademicLayout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout>
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
          Assessments
        </h1>
        {isFaculty ? (
          <Button asChild>
            <Link to="/app/assessments/create">Create Assessment</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to="/app/assessments/me">My Results</Link>
          </Button>
        )}
      </div>

      <DataGrid
        data={assessments ?? []}
        columns={columns}
        getRowId={(a) => a.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search assessments…"
        getSearchableText={(a) => a.title}
        emptyTitle="No assessments yet"
        emptyDescription={
          isFaculty
            ? "Create your first assessment to get started."
            : "Check back soon for available assessments."
        }
      />
    </div>
    </AcademicLayout>
  );
}
