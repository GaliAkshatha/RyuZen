import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { interviewRoundService } from "@/domains/interview-rounds/interviewRoundService";
import type { InterviewRound } from "@/domains/interview-rounds/interviewRound.types";

export function useInterviewRoundsForApplication(applicationId: string) {
  return useApiQuery<InterviewRound[]>({
    queryKey: ["interview-rounds", "application", applicationId] as const,
    queryFn: () => interviewRoundService.listForApplication(applicationId),
    enabled: Boolean(applicationId),
  });
}
