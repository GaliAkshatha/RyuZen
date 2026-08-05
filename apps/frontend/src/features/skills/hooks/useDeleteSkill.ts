import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { skillService } from "@/features/skills/services/skill.service";
import { MY_SKILLS_QUERY_KEY } from "@/features/skills/hooks/useMySkills";
import { PENDING_SKILL_SUGGESTIONS_QUERY_KEY } from "@/features/skills/hooks/usePendingSkillSuggestions";

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => skillService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SKILLS_QUERY_KEY });
      // A delete can also be a suggestion rejection (see
      // SkillSuggestionsSection) - harmless no-op refetch otherwise.
      queryClient.invalidateQueries({ queryKey: PENDING_SKILL_SUGGESTIONS_QUERY_KEY });
    },
  });
}
