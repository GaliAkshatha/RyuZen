import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { skillService } from "@/features/skills/services/skill.service";
import { MY_SKILLS_QUERY_KEY } from "@/features/skills/hooks/useMySkills";

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => skillService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SKILLS_QUERY_KEY });
    },
  });
}
