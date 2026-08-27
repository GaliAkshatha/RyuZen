import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { skillService } from "@/domains/skills/skillService";
import { SKILLS_QUERY_KEY, PENDING_SKILLS_QUERY_KEY } from "@/domains/skills/hooks/useSkills";
import { PORTFOLIO_QUERY_KEY } from "@/domains/portfolio/hooks/usePortfolio";
import type { Skill } from "@/domains/skills/skill.types";

/** Approving is what makes an AI suggestion a real skill - the aggregate portfolio endpoint only ever shows approved===true skills, confirmed directly in GetUserPortfolioUseCase, so this also invalidates the portfolio query. */
export function useApproveSkill() {
  const queryClient = useQueryClient();
  return useApiMutation<Skill, string>({
    mutationFn: (id) => skillService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
    },
  });
}
