import { useState } from "react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";

import { InterviewRoundsPanel } from "@/features/interview-rounds/components/InterviewRoundsPanel";
import type { JobApplicationResponseDto } from "@/features/job-applications/types/jobApplication.types";

/**
 * Shared between the Applicants workspace and Candidate Search
 * results - same real data shape (JobApplicationResponseDto, already
 * enriched with the real student name server-side), same expandable
 * interview-management pattern. Extracted rather than duplicated when
 * the Recruiter dashboard was split into separate workspaces.
 */
export function ApplicantsTable({
  applicants,
  isLoading,
  emptyTitle,
  emptyDescription,
}: {
  applicants: JobApplicationResponseDto[];
  isLoading: boolean;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const columns: DataGridColumn<JobApplicationResponseDto>[] = [
    { key: "studentId", header: "Student", render: (a) => a.studentName ?? a.studentId },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "appliedAt",
      header: "Applied",
      render: (a) => new Date(a.appliedAt).toLocaleDateString(),
      sortable: true,
      sortValue: (a) => new Date(a.appliedAt).getTime(),
    },
    {
      key: "resume",
      header: "Resume",
      render: (a) =>
        a.resume ? (
          <a
            href={a.resume}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4"
          >
            View
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "interviews",
      header: "Interviews",
      render: (a) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedApplicationId(selectedApplicationId === a.id ? null : a.id)}
        >
          {selectedApplicationId === a.id ? "Close" : "Manage"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DataGrid
        data={applicants}
        columns={columns}
        getRowId={(a) => a.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Filter results by student…"
        getSearchableText={(a) => a.studentName ?? a.studentId}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />

      {selectedApplicationId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interview Rounds</CardTitle>
          </CardHeader>
          <CardContent>
            <InterviewRoundsPanel applicationId={selectedApplicationId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
