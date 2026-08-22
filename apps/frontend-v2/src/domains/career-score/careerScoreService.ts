import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { CareerScore } from "@/domains/career-score/careerScore.types";

/** GET /ai/career-score is self-scoped for STUDENT. GET /ai/career-score/:userId is real RECRUITER-only access to a candidate's score, added this pass - genuinely checked server-side (RecruiterCandidateAccessService) that this candidate applied to one of the recruiter's own drives, not a static gate. */
export const careerScoreService = {
  async getMine(): Promise<CareerScore> {
    const res = await apiClient.get<ApiSuccessResponse<CareerScore>>("/ai/career-score");
    return res.data.data;
  },

  async getForCandidate(userId: string): Promise<CareerScore> {
    const res = await apiClient.get<ApiSuccessResponse<CareerScore>>(`/ai/career-score/${userId}`);
    return res.data.data;
  },
};
