import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { skillService } from "@/features/skills/services/skill.service";
import { MY_SKILLS_QUERY_KEY } from "@/features/skills/hooks/useMySkills";
import type { CreateSkillPayload, SkillResponseDto } from "@/features/skills/types/skill.types";

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useApiMutation<SkillResponseDto, CreateSkillPayload>({
    mutationFn: skillService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SKILLS_QUERY_KEY });
    },
  });
}
