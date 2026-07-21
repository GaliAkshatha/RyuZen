import { useApiQuery } from "@/hooks/useApiQuery";

import { experienceService } from "@/features/experience/services/experience.service";

export function useUserExperience(userId: string) {
  return useApiQuery({
    queryKey: ["experience", "users", userId] as const,
    queryFn: () => experienceService.listForUser(userId),
    enabled: Boolean(userId),
  });
}
