import { useApiQuery } from "@/hooks/useApiQuery";

import { leaderboardService } from "@/features/leaderboard/services/leaderboard.service";

export const LEADERBOARD_QUERY_KEY = ["leaderboard"] as const;

export function useLeaderboard() {
  return useApiQuery({
    queryKey: LEADERBOARD_QUERY_KEY,
    queryFn: leaderboardService.list,
  });
}
