import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { badgeService } from "@/features/badges/services/badge.service";
import { BADGES_QUERY_KEY } from "@/features/badges/hooks/useBadges";

export function useDeleteBadge() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => badgeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
    },
  });
}
