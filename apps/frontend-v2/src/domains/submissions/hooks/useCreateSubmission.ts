import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { submissionService } from "@/domains/submissions/submissionService";
import { MY_SUBMISSIONS_QUERY_KEY } from "@/domains/submissions/hooks/useMySubmissions";
import type { CreateSubmissionRequest, Submission } from "@/domains/submissions/submission.types";

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useApiMutation<Submission, CreateSubmissionRequest>({
    mutationFn: (payload) => submissionService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_SUBMISSIONS_QUERY_KEY }),
  });
}
