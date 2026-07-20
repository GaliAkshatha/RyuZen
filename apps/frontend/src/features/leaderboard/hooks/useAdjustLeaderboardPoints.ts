import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { leaderboardService } from "@/features/leaderboard/services/leaderboard.service";
import { LEADERBOARD_QUERY_KEY } from "@/features/leaderboard/hooks/useLeaderboard";
import type {
  AdjustLeaderboardPointsPayload,
  LeaderboardEntryResponseDto,
} from "@/features/leaderboard/types/leaderboard.types";

export function useAdjustLeaderboardPoints(studentId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<LeaderboardEntryResponseDto, AdjustLeaderboardPointsPayload>({
    mutationFn: (payload) => leaderboardService.adjustPoints(studentId, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY });
      queryClient.setQueryData(["leaderboard", studentId], updated);
    },
  });
}
