import { useApiQuery } from "@/hooks/useApiQuery";

import { achievementService } from "@/features/achievements/services/achievement.service";

export const MY_ACHIEVEMENTS_QUERY_KEY = ["achievements", "mine"] as const;

export function useMyAchievements() {
  return useApiQuery({
    queryKey: MY_ACHIEVEMENTS_QUERY_KEY,
    queryFn: achievementService.listMine,
  });
}
