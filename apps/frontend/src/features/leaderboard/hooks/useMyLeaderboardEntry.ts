import { useApiQuery } from "@/hooks/useApiQuery";

import { leaderboardService } from "@/features/leaderboard/services/leaderboard.service";

export function useMyLeaderboardEntry() {
  return useApiQuery({
    queryKey: ["leaderboard", "me"] as const,
    queryFn: leaderboardService.getMyEntry,
  });
}
