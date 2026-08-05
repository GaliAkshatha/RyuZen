import { useApiQuery } from "@/hooks/useApiQuery";

import { skillService } from "@/features/skills/services/skill.service";

export const PENDING_SKILL_SUGGESTIONS_QUERY_KEY = ["skills", "suggestions", "pending"] as const;

export function usePendingSkillSuggestions() {
  return useApiQuery({
    queryKey: PENDING_SKILL_SUGGESTIONS_QUERY_KEY,
    queryFn: skillService.listPending,
  });
}
