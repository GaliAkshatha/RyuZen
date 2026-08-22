import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import type { AnswerMockInterviewRequest, MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useAnswerMockInterview(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<MockInterviewSession, AnswerMockInterviewRequest>({
    mutationFn: (payload) => mockInterviewService.answer(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mock-interviews", id] }),
  });
}
