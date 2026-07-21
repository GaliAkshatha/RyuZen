import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { portfolioProjectService } from "@/features/portfolio/services/portfolioProject.service";
import { MY_PORTFOLIO_PROJECTS_QUERY_KEY } from "@/features/portfolio/hooks/useMyPortfolioProjects";

export function useDeletePortfolioProject() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => portfolioProjectService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PORTFOLIO_PROJECTS_QUERY_KEY });
    },
  });
}
