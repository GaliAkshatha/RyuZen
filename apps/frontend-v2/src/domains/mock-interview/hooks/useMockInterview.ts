import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import type { MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useMockInterview(id: string) {
  return useApiQuery<MockInterviewSession>({
    queryKey: ["mock-interviews", id] as const,
    queryFn: () => mockInterviewService.getById(id),
    enabled: Boolean(id),
  });
}
