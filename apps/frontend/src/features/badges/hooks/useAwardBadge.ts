import { useApiMutation } from "@/hooks/useApiMutation";

import { badgeService } from "@/features/badges/services/badge.service";
import type {
  AwardBadgePayload,
  StudentBadgeResponseDto,
} from "@/features/badges/types/badge.types";

export function useAwardBadge(badgeId: string) {
  return useApiMutation<StudentBadgeResponseDto, AwardBadgePayload>({
    mutationFn: (payload) => badgeService.award(badgeId, payload),
  });
}
