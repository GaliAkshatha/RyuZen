import { useApiQuery } from "@/hooks/useApiQuery";

import { portfolioProjectService } from "@/features/portfolio/services/portfolioProject.service";

export const MY_PORTFOLIO_PROJECTS_QUERY_KEY = ["portfolio-projects", "mine"] as const;

export function useMyPortfolioProjects() {
  return useApiQuery({
    queryKey: MY_PORTFOLIO_PROJECTS_QUERY_KEY,
    queryFn: portfolioProjectService.listMine,
  });
}
