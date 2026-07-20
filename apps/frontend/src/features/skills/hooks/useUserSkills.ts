import { useApiQuery } from "@/hooks/useApiQuery";

import { skillService } from "@/features/skills/services/skill.service";

export function useUserSkills(userId: string) {
  return useApiQuery({
    queryKey: ["skills", "users", userId] as const,
    queryFn: () => skillService.listForUser(userId),
    enabled: Boolean(userId),
  });
}
