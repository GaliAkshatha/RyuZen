import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { badgeService } from "@/domains/badges/badgeService";
import type { StudentBadge } from "@/domains/badges/badge.types";

export function useMyBadges() {
  return useApiQuery<StudentBadge[]>({
    queryKey: ["badges", "me"] as const,
    queryFn: badgeService.getMine,
  });
}
