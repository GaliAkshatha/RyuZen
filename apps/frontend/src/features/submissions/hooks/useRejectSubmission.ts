import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { submissionService } from "@/features/submissions/services/submission.service";
import { SUBMISSIONS_QUERY_KEY } from "@/features/submissions/hooks/useSubmissions";
import type {
  RejectSubmissionPayload,
  SubmissionResponseDto,
} from "@/features/submissions/types/submission.types";

export function useRejectSubmission(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<SubmissionResponseDto, RejectSubmissionPayload>({
    mutationFn: (payload) => submissionService.reject(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SUBMISSIONS_QUERY_KEY });
      queryClient.setQueryData(["submissions", id], updated);
    },
  });
}
