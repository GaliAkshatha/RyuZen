import { useApiMutation } from "@/hooks/useApiMutation";

import { assessmentService } from "@/features/assessments/services/assessment.service";
import type { AssessmentAttemptResponseDto } from "@/features/assessments/types/assessment.types";

export function useStartAssessmentAttempt() {
  return useApiMutation<AssessmentAttemptResponseDto, string>({
    mutationFn: (assessmentId) => assessmentService.startAttempt(assessmentId),
  });
}
