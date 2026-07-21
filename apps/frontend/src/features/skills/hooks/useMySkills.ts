import { useApiQuery } from "@/hooks/useApiQuery";

import { skillService } from "@/features/skills/services/skill.service";

export const MY_SKILLS_QUERY_KEY = ["skills", "mine"] as const;

export function useMySkills() {
  return useApiQuery({
    queryKey: MY_SKILLS_QUERY_KEY,
    queryFn: skillService.listMine,
  });
}
