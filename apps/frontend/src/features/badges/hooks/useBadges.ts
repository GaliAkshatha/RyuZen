import { useApiQuery } from "@/hooks/useApiQuery";

import { badgeService } from "@/features/badges/services/badge.service";

export const BADGES_QUERY_KEY = ["badges"] as const;

/** Badges are a global, rarely-changing catalog — GetBadgesUseCase caches server-side for 300s (confirmed in source), so a matching client staleTime avoids refetching data the backend itself hasn't recomputed (H4). */
export function useBadges() {
  return useApiQuery({
    queryKey: BADGES_QUERY_KEY,
    queryFn: badgeService.list,
    staleTime: 5 * 60 * 1000,
  });
}
