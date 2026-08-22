import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import type { MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useMockInterviewsForCandidate(userId: string) {
  return useApiQuery<MockInterviewSession[]>({
    queryKey: ["mock-interview", "candidate", userId] as const,
    queryFn: () => mockInterviewService.listForCandidate(userId),
    enabled: Boolean(userId),
  });
}
