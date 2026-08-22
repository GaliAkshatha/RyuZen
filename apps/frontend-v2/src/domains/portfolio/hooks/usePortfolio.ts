import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { portfolioService } from "@/domains/portfolio/portfolioService";
import type { Portfolio } from "@/domains/portfolio/portfolio.types";

export const PORTFOLIO_QUERY_KEY = ["portfolio", "me"] as const;

export function usePortfolio() {
  return useApiQuery<Portfolio>({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: portfolioService.getMine,
  });
}
