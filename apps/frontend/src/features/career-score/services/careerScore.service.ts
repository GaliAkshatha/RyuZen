import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { CareerScoreResponseDto } from "@/features/career-score/types/careerScore.types";

export const careerScoreService = {
  get(): Promise<CareerScoreResponseDto> {
    return apiClient
      .get<CareerScoreResponseDto>(API_ENDPOINTS.aiCareerScore)
      .then((response) => response.data);
  },
};
