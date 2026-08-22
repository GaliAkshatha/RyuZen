import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import { INTERVIEW_SESSIONS_QUERY_KEY } from "@/domains/mock-interview/hooks/useInterviewSessions";
import type { StartMockInterviewRequest, MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useStartInterview() {
  const queryClient = useQueryClient();
  return useApiMutation<MockInterviewSession, StartMockInterviewRequest>({
    mutationFn: (payload) => mockInterviewService.start(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEW_SESSIONS_QUERY_KEY }),
  });
}
