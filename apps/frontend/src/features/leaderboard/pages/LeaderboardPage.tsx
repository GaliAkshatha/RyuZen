import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { Badge } from "@/shared/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";

import { useLeaderboard } from "@/features/leaderboard/hooks/useLeaderboard";
import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";
import { RecalculateLeaderboardAction } from "@/features/leaderboard/components/RecalculateLeaderboardAction";
import { LeaderboardPodium } from "@/features/leaderboard/components/LeaderboardPodium";
import { canAdjustLeaderboard } from "@/features/leaderboard/utils/leaderboardPermissions";
import type { LeaderboardEntryResponseDto } from "@/features/leaderboard/types/leaderboard.types";

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: entries, isLoading, isError, error, refetch } = useLeaderboard();
  const { data: myEntry } = useMyLeaderboardEntry();

  const sorted = [...(entries ?? [])].sort((a, b) => a.rank - b.rank);
  const [first, second, third, ...rest] = sorted;

  const columns: DataGridColumn<LeaderboardEntryResponseDto>[] = [
    {
      key: "rank",
      header: "Rank",
      render: (e) => (
        <span className={e.rank <= 3 ? "font-display font-bold text-primary" : ""}>#{e.rank}</span>
      ),
      sortable: true,
      sortValue: (e) => e.rank,
    },
    {
      key: "student",
      header: "Student",
      render: (e) => {
        const isMe = myEntry?.studentId === e.studentId;
        return (
          <span className="flex items-center gap-2">
            {e.studentName ?? e.studentId}
            {isMe && (
              <Badge variant="secondary" className="text-[10px]">
                You
              </Badge>
            )}
          </span>
        );
      },
    },
    {
      key: "totalPoints",
      header: "Total Points",
      render: (e) => e.totalPoints.toLocaleString(),
      sortable: true,
      sortValue: (e) => e.totalPoints,
    },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="constellation" />

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Trophy className="h-6 w-6 text-warning" aria-hidden="true" />
          Leaderboard
        </h1>
        {canAdjustLeaderboard(user?.role) && <RecalculateLeaderboardAction />}
      </div>

      {!isLoading && sorted.length > 0 && (
        <LeaderboardPodium first={first} second={second} third={third} />
      )}

      <DataGrid
        data={sorted.length > 3 ? rest : []}
        columns={columns}
        getRowId={(e) => e.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search students…"
        getSearchableText={(e) => e.studentName ?? e.studentId}
        emptyTitle={sorted.length === 0 ? "No leaderboard entries yet" : "That's everyone in the top 3"}
        emptyDescription="Points are earned through activities, clubs, events, and placements."
        onRowClick={(e) => navigate(`/app/leaderboard/${e.studentId}`)}
        getRowClassName={(e) => (myEntry?.studentId === e.studentId ? "bg-primary/5" : undefined)}
      />
    </div>
  );
}
