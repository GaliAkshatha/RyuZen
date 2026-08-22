import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { portfolioService } from "@/domains/portfolio/portfolioService";
import type { Portfolio } from "@/domains/portfolio/portfolio.types";

export function usePortfolioForUser(userId: string) {
  return useApiQuery<Portfolio>({
    queryKey: ["portfolio", "user", userId] as const,
    queryFn: () => portfolioService.getForUser(userId),
    enabled: Boolean(userId),
  });
}
