import { useApiQuery } from "@/hooks/useApiQuery";

import { assessmentService } from "@/features/assessments/services/assessment.service";

export function useMyAssessmentAttempts() {
  return useApiQuery({
    queryKey: ["assessments", "my-attempts"],
    queryFn: assessmentService.getMyAttempts,
  });
}
