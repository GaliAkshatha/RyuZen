import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import { INTERVIEW_SESSIONS_QUERY_KEY } from "@/domains/mock-interview/hooks/useInterviewSessions";
import type { AnswerMockInterviewRequest, MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useAnswerInterview(sessionId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<MockInterviewSession, AnswerMockInterviewRequest>({
    mutationFn: (payload) => mockInterviewService.answer(sessionId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEW_SESSIONS_QUERY_KEY }),
  });
}
