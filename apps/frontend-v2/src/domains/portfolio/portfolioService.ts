import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Portfolio, UpdatePortfolioSettingsRequest } from "@/domains/portfolio/portfolio.types";

/** Confirmed real mount: /api/v1/portfolio. Both /me routes are genuinely STUDENT-only (confirmed - the route's own comment states this was previously open to any role and got fixed). */
export const portfolioService = {
  async getMine(): Promise<Portfolio> {
    const res = await apiClient.get<ApiSuccessResponse<Portfolio>>("/portfolio/me");
    return res.data.data;
  },

  async updateSettings(payload: UpdatePortfolioSettingsRequest): Promise<Portfolio> {
    const res = await apiClient.patch<ApiSuccessResponse<Portfolio>>("/portfolio/me", payload);
    return res.data.data;
  },
};
