import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { skillService } from "@/domains/skills/skillService";
import { SKILLS_QUERY_KEY, PENDING_SKILLS_QUERY_KEY } from "@/domains/skills/hooks/useSkills";
import { PORTFOLIO_QUERY_KEY } from "@/domains/portfolio/hooks/usePortfolio";

/** Used both to delete an approved skill and to dismiss a pending AI suggestion the student doesn't want - same real endpoint either way. */
export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (id) => skillService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
    },
  });
}
