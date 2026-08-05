import { useApiQuery } from "@/hooks/useApiQuery";

import { assessmentService } from "@/features/assessments/services/assessment.service";

export function useAssessmentResults(assessmentId: string) {
  return useApiQuery({
    queryKey: ["assessments", "results", assessmentId],
    queryFn: () => assessmentService.getResults(assessmentId),
  });
}
