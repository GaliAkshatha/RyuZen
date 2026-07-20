import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { achievementService } from "@/features/achievements/services/achievement.service";
import { MY_ACHIEVEMENTS_QUERY_KEY } from "@/features/achievements/hooks/useMyAchievements";
import type {
  AchievementResponseDto,
  UpdateAchievementPayload,
} from "@/features/achievements/types/achievement.types";

export function useUpdateAchievement(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<AchievementResponseDto, UpdateAchievementPayload>({
    mutationFn: (payload) => achievementService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MY_ACHIEVEMENTS_QUERY_KEY });
      queryClient.setQueryData(["achievements", id], updated);
    },
  });
}
