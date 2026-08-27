import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { skillService } from "@/domains/skills/skillService";
import { SKILLS_QUERY_KEY, PENDING_SKILLS_QUERY_KEY } from "@/domains/skills/hooks/useSkills";
import type { Skill } from "@/domains/skills/skill.types";

/** Real AI extraction from the student's own projects, certifications, experience, and approved activities - creates AI_SUGGESTED, unapproved skills only, never auto-approved. */
export function useExtractSkills() {
  const queryClient = useQueryClient();
  return useApiMutation<Skill[], void>({
    mutationFn: () => skillService.extract(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_SKILLS_QUERY_KEY });
    },
  });
}
