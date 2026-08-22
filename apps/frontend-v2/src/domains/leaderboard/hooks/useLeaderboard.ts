import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { leaderboardService } from "@/domains/leaderboard/leaderboardService";
import type { LeaderboardEntry } from "@/domains/leaderboard/leaderboard.types";

export function useLeaderboard() {
  return useApiQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"] as const,
    queryFn: leaderboardService.list,
  });
}
