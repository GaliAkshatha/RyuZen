import { useApiMutation } from "@/hooks/useApiMutation";

import { assessmentService } from "@/features/assessments/services/assessment.service";
import type {
  AssessmentAttemptResponseDto,
  RecordAssessmentAnswerPayload,
} from "@/features/assessments/types/assessment.types";

export function useRecordAssessmentAnswer(attemptId: string) {
  return useApiMutation<AssessmentAttemptResponseDto, RecordAssessmentAnswerPayload>({
    mutationFn: (payload) => assessmentService.recordAnswer(attemptId, payload),
  });
}
