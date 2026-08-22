import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { interviewRoundService } from "@/domains/interview-rounds/interviewRoundService";
import type { RecordInterviewEvaluationRequest, InterviewRound } from "@/domains/interview-rounds/interviewRound.types";

export function useRecordInterviewEvaluation(applicationId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<InterviewRound, { id: string; payload: RecordInterviewEvaluationRequest }>({
    mutationFn: ({ id, payload }) => interviewRoundService.evaluate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-rounds", "application", applicationId] });
    },
  });
}
