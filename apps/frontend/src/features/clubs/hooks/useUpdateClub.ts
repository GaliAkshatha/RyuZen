import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { clubService } from "@/features/clubs/services/club.service";
import { CLUBS_QUERY_KEY } from "@/features/clubs/hooks/useClubs";
import type { ClubResponseDto, UpdateClubPayload } from "@/features/clubs/types/club.types";

export function useUpdateClub(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ClubResponseDto, UpdateClubPayload>({
    mutationFn: (payload) => clubService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY });
      queryClient.setQueryData(["clubs", id], updated);
    },
  });
}
