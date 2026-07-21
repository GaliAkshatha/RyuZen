import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { badgeService } from "@/features/badges/services/badge.service";
import { BADGES_QUERY_KEY } from "@/features/badges/hooks/useBadges";
import type { BadgeResponseDto, CreateBadgePayload } from "@/features/badges/types/badge.types";

export function useCreateBadge() {
  const queryClient = useQueryClient();

  return useApiMutation<BadgeResponseDto, CreateBadgePayload>({
    mutationFn: badgeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
    },
  });
}
