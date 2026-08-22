import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { interviewRoundService } from "@/domains/interview-rounds/interviewRoundService";
import type { ScheduleInterviewRoundRequest, InterviewRound } from "@/domains/interview-rounds/interviewRound.types";

export function useScheduleInterviewRound(applicationId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<InterviewRound, ScheduleInterviewRoundRequest>({
    mutationFn: (payload) => interviewRoundService.schedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-rounds", "application", applicationId] });
    },
  });
}
