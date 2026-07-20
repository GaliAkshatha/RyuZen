import { useApiQuery } from "@/hooks/useApiQuery";

import { userPortfolioService } from "@/features/portfolio/services/userPortfolio.service";

export const MY_PORTFOLIO_QUERY_KEY = ["portfolio", "mine"] as const;

export function useMyPortfolio() {
  return useApiQuery({
    queryKey: MY_PORTFOLIO_QUERY_KEY,
    queryFn: userPortfolioService.getMine,
  });
}
