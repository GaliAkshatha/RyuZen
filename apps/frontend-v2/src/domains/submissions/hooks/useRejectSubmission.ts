import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { submissionService } from "@/domains/submissions/submissionService";
import type { RejectSubmissionRequest, Submission } from "@/domains/submissions/submission.types";

export function useRejectSubmission(activityId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Submission, { submissionId: string; payload: RejectSubmissionRequest }>({
    mutationFn: ({ submissionId, payload }) => submissionService.reject(submissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", "activity", activityId] });
    },
  });
}
