import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { submissionService } from "@/features/submissions/services/submission.service";
import { SUBMISSIONS_QUERY_KEY } from "@/features/submissions/hooks/useSubmissions";
import type {
  ResubmitSubmissionPayload,
  SubmissionResponseDto,
} from "@/features/submissions/types/submission.types";

export function useResubmitSubmission(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<SubmissionResponseDto, ResubmitSubmissionPayload>({
    mutationFn: (payload) => submissionService.resubmit(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SUBMISSIONS_QUERY_KEY });
      queryClient.setQueryData(["submissions", id], updated);
    },
  });
}
