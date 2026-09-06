import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import type { MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useMockInterviewHistory() {
  return useApiQuery<MockInterviewSession[]>({
    queryKey: ["mock-interviews"] as const,
    queryFn: mockInterviewService.list,
  });
}
