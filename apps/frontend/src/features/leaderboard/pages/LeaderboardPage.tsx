import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { useAuth } from "@/contexts/AuthContext";

import { useLeaderboard } from "@/features/leaderboard/hooks/useLeaderboard";
import { RecalculateLeaderboardAction } from "@/features/leaderboard/components/RecalculateLeaderboardAction";
import { canAdjustLeaderboard } from "@/features/leaderboard/utils/leaderboardPermissions";
import type { LeaderboardEntryResponseDto } from "@/features/leaderboard/types/leaderboard.types";

import { useStudents } from "@/features/students/hooks/useStudents";
import { studentLabel, resolveStudentById } from "@/features/students/utils/studentLabels";

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: entries, isLoading, isError, error, refetch } = useLeaderboard();
  const { data: students } = useStudents();

  const sorted = [...(entries ?? [])].sort((a, b) => a.rank - b.rank);

  const columns: DataGridColumn<LeaderboardEntryResponseDto>[] = [
    {
      key: "rank",
      header: "Rank",
      render: (e) => `#${e.rank}`,
      sortable: true,
      sortValue: (e) => e.rank,
    },
    {
      key: "student",
      header: "Student",
      render: (e) => {
        const student = resolveStudentById(students, e.studentId);
        return student ? studentLabel(student) : e.studentId;
      },
    },
    {
      key: "totalPoints",
      header: "Total Points",
      render: (e) => e.totalPoints,
      sortable: true,
      sortValue: (e) => e.totalPoints,
    },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Trophy className="h-6 w-6 text-warning" aria-hidden="true" />
          Leaderboard
        </h1>
        {canAdjustLeaderboard(user?.role) && <RecalculateLeaderboardAction />}
      </div>

      <DataGrid
        data={sorted}
        columns={columns}
        getRowId={(e) => e.id}
        isLoading={isLoading}
        emptyTitle="No leaderboard entries yet"
        emptyDescription="Points are earned through activities, clubs, events, and placements."
        onRowClick={(e) => navigate(`/app/leaderboard/${e.studentId}`)}
      />
    </div>
  );
}
