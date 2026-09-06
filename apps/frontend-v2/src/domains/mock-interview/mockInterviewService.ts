import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  MockInterviewSession,
  StartMockInterviewRequest,
  AnswerMockInterviewRequest,
} from "@/domains/mock-interview/mockInterview.types";

/** Confirmed real mount /api/v1/ai/interview, open to any authenticated user. */
export const mockInterviewService = {
  async start(payload: StartMockInterviewRequest): Promise<MockInterviewSession> {
    const res = await apiClient.post<ApiSuccessResponse<MockInterviewSession>>("/ai/interview", payload);
    return res.data.data;
  },
  async list(): Promise<MockInterviewSession[]> {
    const res = await apiClient.get<ApiSuccessResponse<MockInterviewSession[]>>("/ai/interview");
    return res.data.data;
  },
  async getById(id: string): Promise<MockInterviewSession> {
    const res = await apiClient.get<ApiSuccessResponse<MockInterviewSession>>(`/ai/interview/${id}`);
    return res.data.data;
  },
  async answer(id: string, payload: AnswerMockInterviewRequest): Promise<MockInterviewSession> {
    const res = await apiClient.post<ApiSuccessResponse<MockInterviewSession>>(`/ai/interview/${id}/answer`, payload);
    return res.data.data;
  },

  /** Real, distinct from answer - ends the session early with no request body, scored on whatever was actually answered. */
  async abandon(id: string): Promise<MockInterviewSession> {
    const res = await apiClient.post<ApiSuccessResponse<MockInterviewSession>>(`/ai/interview/${id}/abandon`);
    return res.data.data;
  },

  /** Real RECRUITER-only route - confirmed the caller must have a genuine RecruiterCandidateAccessService-checked relationship to this candidate (they applied to one of the recruiter's own drives), enforced server-side on every call, not just at login. */
  async listForCandidate(userId: string): Promise<MockInterviewSession[]> {
    const res = await apiClient.get<ApiSuccessResponse<MockInterviewSession[]>>(`/ai/interview/candidate/${userId}`);
    return res.data.data;
  },
};
