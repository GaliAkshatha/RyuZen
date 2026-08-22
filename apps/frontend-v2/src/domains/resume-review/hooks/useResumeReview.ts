import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { resumeReviewService } from "@/domains/resume-review/resumeReviewService";
import type { ResumeReview } from "@/domains/resume-review/resumeReview.types";

/** A mutation, not a query - review only runs when the student explicitly requests it, not automatically. */
export function useResumeReview() {
  return useApiMutation<ResumeReview, void>({
    mutationFn: () => resumeReviewService.review(),
  });
}
