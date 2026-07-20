import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { clubService } from "@/features/clubs/services/club.service";
import { CLUBS_QUERY_KEY } from "@/features/clubs/hooks/useClubs";

export function useDeleteClub() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => clubService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY });
    },
  });
}
