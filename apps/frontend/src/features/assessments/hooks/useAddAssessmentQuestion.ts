import { useApiMutation } from "@/hooks/useApiMutation";

import { assessmentService } from "@/features/assessments/services/assessment.service";
import type {
  AssessmentQuestionResponseDto,
  AddAssessmentQuestionPayload,
} from "@/features/assessments/types/assessment.types";

export function useAddAssessmentQuestion(assessmentId: string) {
  return useApiMutation<AssessmentQuestionResponseDto, AddAssessmentQuestionPayload>({
    mutationFn: (payload) => assessmentService.addQuestion(assessmentId, payload),
  });
}
