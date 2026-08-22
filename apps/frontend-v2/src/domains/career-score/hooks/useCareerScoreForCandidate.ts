import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { careerScoreService } from "@/domains/career-score/careerScoreService";
import type { CareerScore } from "@/domains/career-score/careerScore.types";

export function useCareerScoreForCandidate(userId: string) {
  return useApiQuery<CareerScore>({
    queryKey: ["career-score", "candidate", userId] as const,
    queryFn: () => careerScoreService.getForCandidate(userId),
    enabled: Boolean(userId),
  });
}
