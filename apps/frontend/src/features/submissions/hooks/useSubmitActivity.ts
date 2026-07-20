import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { submissionService } from "@/features/submissions/services/submission.service";
import { SUBMISSIONS_QUERY_KEY } from "@/features/submissions/hooks/useSubmissions";
import type {
  CreateSubmissionPayload,
  SubmissionResponseDto,
} from "@/features/submissions/types/submission.types";

export function useSubmitActivity() {
  const queryClient = useQueryClient();

  return useApiMutation<SubmissionResponseDto, CreateSubmissionPayload>({
    mutationFn: submissionService.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBMISSIONS_QUERY_KEY });
    },
  });
}
