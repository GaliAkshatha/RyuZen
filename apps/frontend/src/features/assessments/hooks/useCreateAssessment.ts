import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { assessmentService } from "@/features/assessments/services/assessment.service";
import { ASSESSMENTS_QUERY_KEY } from "@/features/assessments/hooks/useAssessments";
import type {
  AssessmentResponseDto,
  CreateAssessmentPayload,
} from "@/features/assessments/types/assessment.types";

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useApiMutation<AssessmentResponseDto, CreateAssessmentPayload>({
    mutationFn: (payload) => assessmentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
    },
  });
}
