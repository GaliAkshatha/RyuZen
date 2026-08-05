import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { skillService } from "@/features/skills/services/skill.service";
import type { SkillResponseDto } from "@/features/skills/types/skill.types";
import { PENDING_SKILL_SUGGESTIONS_QUERY_KEY } from "@/features/skills/hooks/usePendingSkillSuggestions";

export function useExtractSkills() {
  const queryClient = useQueryClient();

  return useApiMutation<SkillResponseDto[], void>({
    mutationFn: () => skillService.extract(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_SKILL_SUGGESTIONS_QUERY_KEY });
    },
  });
}
