import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import type { MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export function useAbandonMockInterview(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<MockInterviewSession, void>({
    mutationFn: () => mockInterviewService.abandon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-interviews", id] });
      queryClient.invalidateQueries({ queryKey: ["mock-interviews"] });
    },
  });
}
