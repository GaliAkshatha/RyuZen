import { useApiQuery } from "@/hooks/useApiQuery";

import { assessmentService } from "@/features/assessments/services/assessment.service";

export const ASSESSMENTS_QUERY_KEY = ["assessments"] as const;

export function useAssessments() {
  return useApiQuery({
    queryKey: ASSESSMENTS_QUERY_KEY,
    queryFn: assessmentService.list,
  });
}
