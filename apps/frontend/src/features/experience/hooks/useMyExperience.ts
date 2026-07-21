import { useApiQuery } from "@/hooks/useApiQuery";

import { experienceService } from "@/features/experience/services/experience.service";

export const MY_EXPERIENCE_QUERY_KEY = ["experience", "mine"] as const;

export function useMyExperience() {
  return useApiQuery({
    queryKey: MY_EXPERIENCE_QUERY_KEY,
    queryFn: experienceService.listMine,
  });
}
