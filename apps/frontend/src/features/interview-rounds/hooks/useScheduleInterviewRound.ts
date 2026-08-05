import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { interviewRoundService } from "@/features/interview-rounds/services/interviewRound.service";
import { interviewRoundsQueryKey } from "@/features/interview-rounds/hooks/useInterviewRoundsForApplication";
import type {
  InterviewRoundResponseDto,
  ScheduleInterviewRoundPayload,
} from "@/features/interview-rounds/types/interviewRound.types";

export function useScheduleInterviewRound(applicationId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<InterviewRoundResponseDto, ScheduleInterviewRoundPayload>({
    mutationFn: (payload) => interviewRoundService.schedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewRoundsQueryKey(applicationId) });
    },
  });
}
