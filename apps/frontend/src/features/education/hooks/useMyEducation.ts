import { useApiQuery } from "@/hooks/useApiQuery";

import { educationService } from "@/features/education/services/education.service";

export const MY_EDUCATION_QUERY_KEY = ["education", "mine"] as const;

export function useMyEducation() {
  return useApiQuery({
    queryKey: MY_EDUCATION_QUERY_KEY,
    queryFn: educationService.listMine,
  });
}
