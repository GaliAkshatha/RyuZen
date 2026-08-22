import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { submissionService } from "@/domains/submissions/submissionService";
import type { ApproveSubmissionRequest, Submission } from "@/domains/submissions/submission.types";

export function useApproveSubmission(activityId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Submission, { submissionId: string; payload: ApproveSubmissionRequest }>({
    mutationFn: ({ submissionId, payload }) => submissionService.approve(submissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", "activity", activityId] });
    },
  });
}
