import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { assessmentService } from "@/domains/assessments/assessmentService";
import type { Assessment } from "@/domains/assessments/assessment.types";

export const ASSESSMENTS_QUERY_KEY = ["assessments"] as const;

export function useAssessments() {
  return useApiQuery<Assessment[]>({
    queryKey: ASSESSMENTS_QUERY_KEY,
    queryFn: assessmentService.list,
  });
}
