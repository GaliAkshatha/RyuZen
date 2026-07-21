import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { badgeService } from "@/features/badges/services/badge.service";
import { BADGES_QUERY_KEY } from "@/features/badges/hooks/useBadges";
import type { BadgeResponseDto, UpdateBadgePayload } from "@/features/badges/types/badge.types";

export function useUpdateBadge(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<BadgeResponseDto, UpdateBadgePayload>({
    mutationFn: (payload) => badgeService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      queryClient.setQueryData(["badges", id], updated);
    },
  });
}
