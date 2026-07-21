import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  UpdateUserPortfolioPayload,
  UserPortfolioResponseDto,
  UserPortfolioSettingsResponseDto,
} from "@/features/portfolio/types/portfolio.types";

export const userPortfolioService = {
  /** Full aggregated view: skills/projects/experience/education/certifications/achievements all included. */
  getMine(): Promise<UserPortfolioResponseDto> {
    return apiClient
      .get<UserPortfolioResponseDto>(`${API_ENDPOINTS.portfolio}/me`)
      .then((response) => response.data);
  },

  /** Returns the lighter settings-only shape, not the full aggregate — confirmed this milestone. */
  updateSettings(payload: UpdateUserPortfolioPayload): Promise<UserPortfolioSettingsResponseDto> {
    return apiClient
      .patch<UserPortfolioSettingsResponseDto>(`${API_ENDPOINTS.portfolio}/me`, payload)
      .then((response) => response.data);
  },

  /** Subject to the real visibility gate: PRIVATE + non-owner + non-(SUPER_ADMIN/ORG_ADMIN) viewer → 403. */
  getForUser(userId: string): Promise<UserPortfolioResponseDto> {
    return apiClient
      .get<UserPortfolioResponseDto>(`${API_ENDPOINTS.portfolio}/${userId}`)
      .then((response) => response.data);
  },
};
