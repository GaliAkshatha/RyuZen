import { apiClient } from "@/shared/api/apiClient";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { LeaderboardEntry } from "@/domains/leaderboard/leaderboard.types";

/**
 * Real STUDENT-only self-lookup - confirmed GET /leaderboard/me
 * genuinely 404s if the student has no entry yet (no approved
 * points/placement activity), a real, expected state, not an error
 * to hide from - handled explicitly by MyRankCard rather than shown
 * as a scary generic error.
 */
export function useMyLeaderboardEntry() {
  return useApiQuery<LeaderboardEntry>({
    queryKey: ["leaderboard", "me"] as const,
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessResponse<LeaderboardEntry>>("/leaderboard/me");
      return res.data.data;
    },
    retry: false,
  });
}
