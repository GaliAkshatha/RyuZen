import { useApiQuery } from "@/hooks/useApiQuery";

import { badgeService } from "@/features/badges/services/badge.service";

export const BADGES_QUERY_KEY = ["badges"] as const;

export function useBadges() {
  return useApiQuery({
    queryKey: BADGES_QUERY_KEY,
    queryFn: badgeService.list,
  });
}
