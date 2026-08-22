import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { portfolioService } from "@/domains/portfolio/portfolioService";
import { PORTFOLIO_QUERY_KEY } from "@/domains/portfolio/hooks/usePortfolio";
import type { UpdatePortfolioSettingsRequest, Portfolio } from "@/domains/portfolio/portfolio.types";

export function useUpdatePortfolioSettings() {
  const queryClient = useQueryClient();
  return useApiMutation<Portfolio, UpdatePortfolioSettingsRequest>({
    mutationFn: (payload) => portfolioService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
    },
  });
}
