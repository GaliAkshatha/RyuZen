import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { achievementService } from "@/features/achievements/services/achievement.service";
import type { AchievementResponseDto } from "@/features/achievements/types/achievement.types";

export function useRejectAchievement(studentId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<AchievementResponseDto, string>({
    mutationFn: (id) => achievementService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements", "students", studentId] });
    },
  });
}
