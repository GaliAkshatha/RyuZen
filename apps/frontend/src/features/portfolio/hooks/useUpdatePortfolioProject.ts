import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { portfolioProjectService } from "@/features/portfolio/services/portfolioProject.service";
import { MY_PORTFOLIO_PROJECTS_QUERY_KEY } from "@/features/portfolio/hooks/useMyPortfolioProjects";
import type {
  PortfolioProjectResponseDto,
  UpdatePortfolioProjectPayload,
} from "@/features/portfolio/types/portfolio.types";

export function useUpdatePortfolioProject(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<PortfolioProjectResponseDto, UpdatePortfolioProjectPayload>({
    mutationFn: (payload) => portfolioProjectService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MY_PORTFOLIO_PROJECTS_QUERY_KEY });
      queryClient.setQueryData(["portfolio-projects", id], updated);
    },
  });
}
