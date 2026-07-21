import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { ResumeReviewResponseDto } from "@/features/resume-review/types/resumeReview.types";

export const resumeReviewService = {
  review(): Promise<ResumeReviewResponseDto> {
    return apiClient
      .post<ResumeReviewResponseDto>(API_ENDPOINTS.aiResumeReview, {})
      .then((response) => response.data);
  },
};
