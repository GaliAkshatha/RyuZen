import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { resumeReviewService } from "@/features/resume-review/services/resumeReview.service";
import type { ResumeReviewResponseDto } from "@/features/resume-review/types/resumeReview.types";

import { MY_RESUME_QUERY_KEY } from "@/features/resume/hooks/useMyResume";

/**
 * A successful review also updates the caller's CE6 Resume.atsScore
 * server-side (if a Resume record exists) — invalidating CE6's cache
 * here means navigating back to "My Resume" reflects the fresh score
 * without a manual refresh.
 */
export function useReviewResume() {
  const queryClient = useQueryClient();

  return useApiMutation<ResumeReviewResponseDto, void>({
    mutationFn: resumeReviewService.review,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_RESUME_QUERY_KEY });
    },
  });
}
