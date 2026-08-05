import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { skillService } from "@/features/skills/services/skill.service";
import type { SkillResponseDto } from "@/features/skills/types/skill.types";
import { MY_SKILLS_QUERY_KEY } from "@/features/skills/hooks/useMySkills";
import { PENDING_SKILL_SUGGESTIONS_QUERY_KEY } from "@/features/skills/hooks/usePendingSkillSuggestions";

export function useApproveSkillSuggestion() {
  const queryClient = useQueryClient();

  return useApiMutation<SkillResponseDto, string>({
    mutationFn: (id) => skillService.approve(id),
    onSuccess: () => {
      // Approving moves a skill from "pending" to "real" — both lists
      // need to reflect that, not just one.
      queryClient.invalidateQueries({ queryKey: PENDING_SKILL_SUGGESTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_SKILLS_QUERY_KEY });
    },
  });
}
