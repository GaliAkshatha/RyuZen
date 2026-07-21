import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { mockInterviewService } from "@/features/mock-interview/services/mockInterview.service";
import { MY_MOCK_INTERVIEWS_QUERY_KEY } from "@/features/mock-interview/hooks/useMyMockInterviews";
import type {
  MockInterviewSessionResponseDto,
  StartMockInterviewPayload,
} from "@/features/mock-interview/types/mockInterview.types";

export function useStartMockInterview() {
  const queryClient = useQueryClient();

  return useApiMutation<MockInterviewSessionResponseDto, StartMockInterviewPayload>({
    mutationFn: mockInterviewService.start,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: MY_MOCK_INTERVIEWS_QUERY_KEY });
      queryClient.setQueryData(["mock-interviews", session.id], session);
    },
  });
}
