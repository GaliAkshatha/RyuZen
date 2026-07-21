import { useApiQuery } from "@/hooks/useApiQuery";

import { careerScoreService } from "@/features/career-score/services/careerScore.service";

export const CAREER_SCORE_QUERY_KEY = ["career-score"] as const;

export function useCareerScore() {
  return useApiQuery({
    queryKey: CAREER_SCORE_QUERY_KEY,
    queryFn: careerScoreService.get,
  });
}
