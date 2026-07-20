import { useApiQuery } from "@/hooks/useApiQuery";

import { badgeService } from "@/features/badges/services/badge.service";

export function useBadge(id: string) {
  return useApiQuery({
    queryKey: ["badges", id] as const,
    queryFn: () => badgeService.getById(id),
    enabled: Boolean(id),
  });
}
