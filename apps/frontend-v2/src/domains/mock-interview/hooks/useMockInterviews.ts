import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import type { MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export const MOCK_INTERVIEWS_QUERY_KEY = ["mock-interviews"] as const;

export function useMockInterviews() {
  return useApiQuery<MockInterviewSession[]>({ queryKey: MOCK_INTERVIEWS_QUERY_KEY, queryFn: mockInterviewService.list });
}
