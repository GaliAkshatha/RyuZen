import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { ResumeReview } from "@/domains/resume-review/resumeReview.types";

/** Confirmed real mount /api/v1/ai/resume-review. Takes no body - reviews the caller's own already-stored resume (confirmed: the use case derives everything from req.user.userId). If no resume is on file, whatever real error the backend returns is surfaced as-is, not hidden. */
export const resumeReviewService = {
  async review(): Promise<ResumeReview> {
    const res = await apiClient.post<ApiSuccessResponse<ResumeReview>>("/ai/resume-review");
    return res.data.data;
  },
};
