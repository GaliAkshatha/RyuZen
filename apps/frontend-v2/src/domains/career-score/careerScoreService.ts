import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { CareerScore } from "@/domains/career-score/careerScore.types";

/** GET /career-score is self-scoped (confirmed - "Get My Career Score", no target-user param exists). */
export const careerScoreService = {
  async getMine(): Promise<CareerScore> {
    const res = await apiClient.get<ApiSuccessResponse<CareerScore>>("/ai/career-score");
    return res.data.data;
  },
};
