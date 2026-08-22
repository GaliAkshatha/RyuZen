import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  InterviewRound,
  ScheduleInterviewRoundRequest,
  RecordInterviewEvaluationRequest,
} from "@/domains/interview-rounds/interviewRound.types";

/**
 * schedule/evaluate confirmed ORG_ADMIN/PLACEMENT_ADMIN/RECRUITER,
 * with real company-scope enforcement server-side for Recruiter (the
 * security fix and its 4 regression tests from earlier this
 * engagement). listForApplication confirmed STUDENT/ORG_ADMIN/
 * PLACEMENT_ADMIN/RECRUITER, also with the real org+ownership check
 * added in that same fix.
 */
export const interviewRoundService = {
  async schedule(payload: ScheduleInterviewRoundRequest): Promise<InterviewRound> {
    const res = await apiClient.post<ApiSuccessResponse<InterviewRound>>("/interview-rounds", payload);
    return res.data.data;
  },

  async evaluate(id: string, payload: RecordInterviewEvaluationRequest): Promise<InterviewRound> {
    const res = await apiClient.patch<ApiSuccessResponse<InterviewRound>>(`/interview-rounds/${id}/evaluate`, payload);
    return res.data.data;
  },

  async listForApplication(applicationId: string): Promise<InterviewRound[]> {
    const res = await apiClient.get<ApiSuccessResponse<InterviewRound[]>>(`/interview-rounds/application/${applicationId}`);
    return res.data.data;
  },
};
