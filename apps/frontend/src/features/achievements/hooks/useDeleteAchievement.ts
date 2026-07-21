import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { achievementService } from "@/features/achievements/services/achievement.service";
import { MY_ACHIEVEMENTS_QUERY_KEY } from "@/features/achievements/hooks/useMyAchievements";

export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => achievementService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ACHIEVEMENTS_QUERY_KEY });
    },
  });
}
