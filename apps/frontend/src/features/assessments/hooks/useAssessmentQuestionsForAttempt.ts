import { useApiQuery } from "@/hooks/useApiQuery";

import { assessmentService } from "@/features/assessments/services/assessment.service";

export function useAssessmentQuestionsForAttempt(assessmentId: string) {
  return useApiQuery({
    queryKey: ["assessments", "questions-for-attempt", assessmentId],
    queryFn: () => assessmentService.getQuestionsForAttempt(assessmentId),
  });
}
