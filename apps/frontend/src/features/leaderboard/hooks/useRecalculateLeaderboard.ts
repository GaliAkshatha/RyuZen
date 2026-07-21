import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { leaderboardService } from "@/features/leaderboard/services/leaderboard.service";
import { LEADERBOARD_QUERY_KEY } from "@/features/leaderboard/hooks/useLeaderboard";
import type { LeaderboardEntryResponseDto } from "@/features/leaderboard/types/leaderboard.types";

export function useRecalculateLeaderboard() {
  const queryClient = useQueryClient();

  return useApiMutation<LeaderboardEntryResponseDto[], void>({
    mutationFn: leaderboardService.recalculate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY });
    },
  });
}
