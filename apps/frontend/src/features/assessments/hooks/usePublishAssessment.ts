import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { assessmentService } from "@/features/assessments/services/assessment.service";
import { ASSESSMENTS_QUERY_KEY } from "@/features/assessments/hooks/useAssessments";
import type { AssessmentResponseDto } from "@/features/assessments/types/assessment.types";

export function usePublishAssessment() {
  const queryClient = useQueryClient();

  return useApiMutation<AssessmentResponseDto, string>({
    mutationFn: (assessmentId) => assessmentService.publish(assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
    },
  });
}
