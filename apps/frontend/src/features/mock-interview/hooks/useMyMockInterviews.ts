import { useApiQuery } from "@/hooks/useApiQuery";

import { mockInterviewService } from "@/features/mock-interview/services/mockInterview.service";

export const MY_MOCK_INTERVIEWS_QUERY_KEY = ["mock-interviews", "mine"] as const;

export function useMyMockInterviews() {
  return useApiQuery({
    queryKey: MY_MOCK_INTERVIEWS_QUERY_KEY,
    queryFn: mockInterviewService.listMine,
  });
}
