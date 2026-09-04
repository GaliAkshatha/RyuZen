import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { assessmentService } from "@/domains/assessments/assessmentService";
import type { StudentAssessmentQuestion } from "@/domains/assessments/assessment.types";

export function useAssessmentQuestionsForAttempt(id: string) {
  return useApiQuery<StudentAssessmentQuestion[]>({
    queryKey: ["assessments", id, "questions", "attempt"] as const,
    queryFn: () => assessmentService.getQuestionsForAttempt(id),
    enabled: Boolean(id),
  });
}
