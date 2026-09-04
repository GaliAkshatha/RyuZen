import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { assessmentService } from "@/domains/assessments/assessmentService";
import type { AssessmentAttempt } from "@/domains/assessments/assessment.types";

export function useAssessmentResults(id: string) {
  return useApiQuery<AssessmentAttempt[]>({
    queryKey: ["assessments", id, "results"] as const,
    queryFn: () => assessmentService.getResults(id),
    enabled: Boolean(id),
  });
}
