import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { badgeService } from "@/domains/badges/badgeService";
import type { Badge } from "@/domains/badges/badge.types";

export const BADGES_QUERY_KEY = ["badges"] as const;

export function useBadges() {
  return useApiQuery<Badge[]>({
    queryKey: BADGES_QUERY_KEY,
    queryFn: badgeService.list,
  });
}
