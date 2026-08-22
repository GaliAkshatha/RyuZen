import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { LeaderboardEntry } from "@/domains/leaderboard/leaderboard.types";

/** GET / confirmed open to any authenticated user, tenant-scoped server-side (organizationId, real). */
export const leaderboardService = {
  async list(): Promise<LeaderboardEntry[]> {
    const res = await apiClient.get<ApiSuccessResponse<LeaderboardEntry[]>>("/leaderboard");
    return res.data.data;
  },
};
