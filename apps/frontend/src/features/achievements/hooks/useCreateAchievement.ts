import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { achievementService } from "@/features/achievements/services/achievement.service";
import { MY_ACHIEVEMENTS_QUERY_KEY } from "@/features/achievements/hooks/useMyAchievements";
import type {
  AchievementResponseDto,
  CreateAchievementPayload,
} from "@/features/achievements/types/achievement.types";

export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useApiMutation<AchievementResponseDto, CreateAchievementPayload>({
    mutationFn: achievementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ACHIEVEMENTS_QUERY_KEY });
    },
  });
}
