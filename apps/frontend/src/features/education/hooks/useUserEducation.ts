import { useApiQuery } from "@/hooks/useApiQuery";

import { educationService } from "@/features/education/services/education.service";

export function useUserEducation(userId: string) {
  return useApiQuery({
    queryKey: ["education", "users", userId] as const,
    queryFn: () => educationService.listForUser(userId),
    enabled: Boolean(userId),
  });
}
