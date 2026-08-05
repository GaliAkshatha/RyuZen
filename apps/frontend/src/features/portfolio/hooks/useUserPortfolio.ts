import { useApiQuery } from "@/hooks/useApiQuery";

import { userPortfolioService } from "@/features/portfolio/services/userPortfolio.service";

/**
 * Consumes the real GET /portfolio/:userId endpoint - built and typed
 * on the frontend already (userPortfolio.service.ts), but never
 * actually rendered anywhere until this hook + UserPortfolioViewPage.
 * Subject to the real backend visibility gate - a PRIVATE portfolio
 * viewed by a non-owner, non-admin genuinely 403s, surfaced via
 * isError below, not silently hidden.
 */
export function useUserPortfolio(userId: string) {
  return useApiQuery({
    queryKey: ["portfolio", "user", userId],
    queryFn: () => userPortfolioService.getForUser(userId),
    enabled: !!userId,
  });
}
