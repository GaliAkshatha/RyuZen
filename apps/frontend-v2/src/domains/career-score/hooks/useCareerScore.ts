import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { careerScoreService } from "@/domains/career-score/careerScoreService";
import type { CareerScore } from "@/domains/career-score/careerScore.types";

export function useCareerScore() {
  return useApiQuery<CareerScore>({
    queryKey: ["career-score", "me"] as const,
    queryFn: careerScoreService.getMine,
  });
}
