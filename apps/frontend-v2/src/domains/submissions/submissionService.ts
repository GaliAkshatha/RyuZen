import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Submission, ApproveSubmissionRequest, RejectSubmissionRequest } from "@/domains/submissions/submission.types";

/**
 * Every call maps 1:1 to a real, confirmed route (submission.routes.ts).
 * list() is always called with a real activityId filter from this
 * portal - GET /submissions has no role restriction at the backend
 * (a real, separately-flagged privacy gap: it doesn't scope results to
 * only the caller's own activities), so the frontend enforces this
 * itself by always filtering, even though the backend doesn't require
 * it. Faculty's own real activity ownership is what makes this
 * legitimate use, not a workaround for the gap.
 */
export const submissionService = {
  async listForActivity(activityId: string): Promise<Submission[]> {
    const res = await apiClient.get<ApiSuccessResponse<Submission[]>>("/submissions", {
      params: { activityId },
    });
    return res.data.data;
  },

  async approve(submissionId: string, payload: ApproveSubmissionRequest): Promise<Submission> {
    const res = await apiClient.patch<ApiSuccessResponse<Submission>>(`/submissions/${submissionId}/approve`, payload);
    return res.data.data;
  },

  async reject(submissionId: string, payload: RejectSubmissionRequest): Promise<Submission> {
    const res = await apiClient.patch<ApiSuccessResponse<Submission>>(`/submissions/${submissionId}/reject`, payload);
    return res.data.data;
  },
};
