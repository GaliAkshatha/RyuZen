import { useApiQuery } from "@/hooks/useApiQuery";

import { achievementService } from "@/features/achievements/services/achievement.service";

export function useStudentAchievements(studentId: string) {
  return useApiQuery({
    queryKey: ["achievements", "students", studentId] as const,
    queryFn: () => achievementService.listForStudent(studentId),
    enabled: Boolean(studentId),
  });
}
