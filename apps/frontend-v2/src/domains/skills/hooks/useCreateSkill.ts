import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { skillService } from "@/domains/skills/skillService";
import { SKILLS_QUERY_KEY } from "@/domains/skills/hooks/useSkills";
import { PORTFOLIO_QUERY_KEY } from "@/domains/portfolio/hooks/usePortfolio";
import type { Skill, CreateSkillRequest } from "@/domains/skills/skill.types";

/** A manually-added skill is approved=true immediately on the backend (the student typed it themselves - nothing to approve), so it shows in the aggregate portfolio right away. */
export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useApiMutation<Skill, CreateSkillRequest>({
    mutationFn: (payload) => skillService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
    },
  });
}
