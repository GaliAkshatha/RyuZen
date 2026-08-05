import { useNavigate } from "react-router-dom";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

import { AcademicLayout } from "@/features/academic-hub/components/AcademicLayout";
import { useSubmissions } from "@/features/submissions/hooks/useSubmissions";
import { canReviewSubmissions } from "@/features/submissions/utils/submissionPermissions";
import type { SubmissionResponseDto } from "@/features/submissions/types/submission.types";

import { useActivities } from "@/features/activities/hooks/useActivities";

const columns: DataGridColumn<SubmissionResponseDto>[] = [
  {
    key: "submittedAt",
    header: "Submitted",
    render: (s) => new Date(s.submittedAt).toLocaleDateString(),
  },
  { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
  {
    key: "points",
    header: "Points Awarded",
    render: (s) => (s.review.reviewedAt ? s.review.pointsAwarded : "—"),
  },
];

/**
 * Role-aware default: reviewers (see submissionPermissions.ts) get the
 * full organization list to find what needs review; everyone else sees
 * only their own submissions — `submittedBy` is the viewer's own
 * User.id, so this needs no cross-referencing lookup.
 */
export function SubmissionListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isReviewer = canReviewSubmissions(user?.role);

  const {
    data: submissions,
    isLoading,
    isError,
    error,
    refetch,
  } = useSubmissions(isReviewer ? undefined : user ? { submittedBy: user.id } : undefined);
  const { data: activities } = useActivities();

  const activityTitleById = new Map((activities ?? []).map((a) => [a.id, a.title]));

  const columnsWithActivity: DataGridColumn<SubmissionResponseDto>[] = [
    {
      key: "activity",
      header: "Activity",
      render: (s) => activityTitleById.get(s.activityId) ?? s.activityId,
    },
    ...columns,
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
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          {isReviewer ? "Submissions" : "My Submissions"}
        </h1>

        <DataGrid
          data={submissions ?? []}
          columns={columnsWithActivity}
          getRowId={(s) => s.id}
          isLoading={isLoading}
          emptyTitle={isReviewer ? "No submissions yet" : "You haven't submitted anything yet"}
          emptyDescription={
            isReviewer
              ? "Submissions will appear here once students start submitting activities."
              : "Browse activities and submit your work to see it listed here."
          }
          onRowClick={(s) => navigate(`/app/submissions/${s.id}`)}
        />
      </div>
    </AcademicLayout>
  );
}
