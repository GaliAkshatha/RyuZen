import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Submission,
  CreateSubmissionRequest,
  ApproveSubmissionRequest,
  RejectSubmissionRequest,
} from "@/domains/submissions/submission.types";

/**
 * Every call maps 1:1 to a real, confirmed route (submission.routes.ts).
 * list() (Faculty) always filters by a real activityId they own -
 * enforced server-side too (this engagement's own earlier fix:
 * FACULTY callers must specify a real activity they created, STUDENT
 * callers are always forced to their own submittedBy regardless of
 * what's requested).
 */
export const submissionService = {
  async listForActivity(activityId: string): Promise<Submission[]> {
    const res = await apiClient.get<ApiSuccessResponse<Submission[]>>("/submissions", {
      params: { activityId },
    });
    return res.data.data;
  },

  /** Real STUDENT self-view - submittedBy is forced server-side to the caller's own id regardless of what's requested, so no id param is sent from here. */
  async listMine(): Promise<Submission[]> {
    const res = await apiClient.get<ApiSuccessResponse<Submission[]>>("/submissions");
    return res.data.data;
  },

  async create(payload: CreateSubmissionRequest): Promise<Submission> {
    const res = await apiClient.post<ApiSuccessResponse<Submission>>("/submissions", payload);
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
