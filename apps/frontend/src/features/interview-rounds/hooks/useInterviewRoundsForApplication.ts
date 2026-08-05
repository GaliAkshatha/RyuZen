import { useApiQuery } from "@/hooks/useApiQuery";

import { interviewRoundService } from "@/features/interview-rounds/services/interviewRound.service";

export function interviewRoundsQueryKey(applicationId: string) {
  return ["interview-rounds", "application", applicationId] as const;
}

export function useInterviewRoundsForApplication(applicationId: string) {
  return useApiQuery({
    queryKey: interviewRoundsQueryKey(applicationId),
    queryFn: () => interviewRoundService.getForApplication(applicationId),
  });
}
