import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { skillService } from "@/domains/skills/skillService";
import type { Skill } from "@/domains/skills/skill.types";

export const SKILLS_QUERY_KEY = ["skills"] as const;
export const PENDING_SKILLS_QUERY_KEY = ["skills", "pending"] as const;

export function useSkills() {
  return useApiQuery<Skill[]>({ queryKey: SKILLS_QUERY_KEY, queryFn: skillService.list });
}

export function usePendingSkillSuggestions() {
  return useApiQuery<Skill[]>({ queryKey: PENDING_SKILLS_QUERY_KEY, queryFn: skillService.listPending });
}
