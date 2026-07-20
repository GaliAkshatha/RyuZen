import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { clubService } from "@/features/clubs/services/club.service";
import { CLUBS_QUERY_KEY } from "@/features/clubs/hooks/useClubs";
import type { ClubResponseDto, CreateClubPayload } from "@/features/clubs/types/club.types";

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useApiMutation<ClubResponseDto, CreateClubPayload>({
    mutationFn: clubService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY });
    },
  });
}
