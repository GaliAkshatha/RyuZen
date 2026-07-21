import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { mockInterviewService } from "@/features/mock-interview/services/mockInterview.service";
import type {
  AnswerMockInterviewPayload,
  MockInterviewSessionResponseDto,
} from "@/features/mock-interview/types/mockInterview.types";

export function useAnswerMockInterview(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<MockInterviewSessionResponseDto, AnswerMockInterviewPayload>({
    mutationFn: (payload) => mockInterviewService.answer(id, payload),
    onSuccess: (session) => {
      queryClient.setQueryData(["mock-interviews", id], session);
    },
  });
}
