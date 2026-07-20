import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { skillService } from "@/features/skills/services/skill.service";
import { MY_SKILLS_QUERY_KEY } from "@/features/skills/hooks/useMySkills";
import type { SkillResponseDto, UpdateSkillPayload } from "@/features/skills/types/skill.types";

export function useUpdateSkill(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<SkillResponseDto, UpdateSkillPayload>({
    mutationFn: (payload) => skillService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MY_SKILLS_QUERY_KEY });
      queryClient.setQueryData(["skills", id], updated);
    },
  });
}
