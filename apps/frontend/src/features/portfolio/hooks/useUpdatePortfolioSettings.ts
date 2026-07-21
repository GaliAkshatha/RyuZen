import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { userPortfolioService } from "@/features/portfolio/services/userPortfolio.service";
import { MY_PORTFOLIO_QUERY_KEY } from "@/features/portfolio/hooks/useMyPortfolio";
import type {
  UpdateUserPortfolioPayload,
  UserPortfolioSettingsResponseDto,
} from "@/features/portfolio/types/portfolio.types";

export function useUpdatePortfolioSettings() {
  const queryClient = useQueryClient();

  return useApiMutation<UserPortfolioSettingsResponseDto, UpdateUserPortfolioPayload>({
    mutationFn: userPortfolioService.updateSettings,
    onSuccess: (updatedSettings) => {
      // PATCH /me returns the lighter settings shape, not the full
      // aggregate GET /me returns — merge rather than overwrite so the
      // cached skills/projects/experience/etc. arrays aren't lost.
      queryClient.setQueryData(MY_PORTFOLIO_QUERY_KEY, (previous: unknown) =>
        previous ? { ...previous, ...updatedSettings } : previous,
      );
      queryClient.invalidateQueries({ queryKey: MY_PORTFOLIO_QUERY_KEY });
    },
  });
}
