import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import { MOCK_INTERVIEWS_QUERY_KEY } from "@/domains/mock-interview/hooks/useMockInterviews";
import type { StartMockInterviewRequest, MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useStartMockInterview() {
  const queryClient = useQueryClient();
  return useApiMutation<MockInterviewSession, StartMockInterviewRequest>({
    mutationFn: (payload) => mockInterviewService.start(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MOCK_INTERVIEWS_QUERY_KEY }),
  });
}
