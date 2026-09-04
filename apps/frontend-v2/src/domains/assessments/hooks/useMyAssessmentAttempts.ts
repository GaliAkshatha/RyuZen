import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { assessmentService } from "@/domains/assessments/assessmentService";
import type { AssessmentAttempt } from "@/domains/assessments/assessment.types";

export function useMyAssessmentAttempts() {
  return useApiQuery<AssessmentAttempt[]>({
    queryKey: ["assessments", "attempts", "me"] as const,
    queryFn: assessmentService.getMyAttempts,
  });
}
