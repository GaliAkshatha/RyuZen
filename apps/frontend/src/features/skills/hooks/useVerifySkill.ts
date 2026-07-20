import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { skillService } from "@/features/skills/services/skill.service";
import type { SkillResponseDto } from "@/features/skills/types/skill.types";

export function useVerifySkill(userId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<SkillResponseDto, string>({
    mutationFn: (id) => skillService.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills", "users", userId] });
    },
  });
}
