import { useApiQuery } from "@/hooks/useApiQuery";

import { leaderboardService } from "@/features/leaderboard/services/leaderboard.service";

export function useLeaderboardEntry(studentId: string) {
  return useApiQuery({
    queryKey: ["leaderboard", studentId] as const,
    queryFn: () => leaderboardService.getByStudentId(studentId),
    enabled: Boolean(studentId),
  });
}
