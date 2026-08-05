import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { interviewRoundService } from "@/features/interview-rounds/services/interviewRound.service";
import { interviewRoundsQueryKey } from "@/features/interview-rounds/hooks/useInterviewRoundsForApplication";
import type {
  InterviewRoundResponseDto,
  RecordInterviewEvaluationPayload,
} from "@/features/interview-rounds/types/interviewRound.types";

export function useRecordInterviewEvaluation(applicationId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<InterviewRoundResponseDto, { id: string; payload: RecordInterviewEvaluationPayload }>({
    mutationFn: ({ id, payload }) => interviewRoundService.recordEvaluation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewRoundsQueryKey(applicationId) });
    },
  });
}
