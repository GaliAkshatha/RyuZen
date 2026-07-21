import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { portfolioProjectService } from "@/features/portfolio/services/portfolioProject.service";
import { MY_PORTFOLIO_PROJECTS_QUERY_KEY } from "@/features/portfolio/hooks/useMyPortfolioProjects";
import type {
  CreatePortfolioProjectPayload,
  PortfolioProjectResponseDto,
} from "@/features/portfolio/types/portfolio.types";

export function useCreatePortfolioProject() {
  const queryClient = useQueryClient();

  return useApiMutation<PortfolioProjectResponseDto, CreatePortfolioProjectPayload>({
    mutationFn: portfolioProjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PORTFOLIO_PROJECTS_QUERY_KEY });
    },
  });
}
