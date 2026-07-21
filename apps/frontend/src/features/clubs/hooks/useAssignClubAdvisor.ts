import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { clubService } from "@/features/clubs/services/club.service";
import { CLUBS_QUERY_KEY } from "@/features/clubs/hooks/useClubs";
import type { AssignAdvisorPayload, ClubResponseDto } from "@/features/clubs/types/club.types";

export function useAssignClubAdvisor(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ClubResponseDto, AssignAdvisorPayload>({
    mutationFn: (payload) => clubService.assignAdvisor(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY });
      queryClient.setQueryData(["clubs", id], updated);
    },
  });
}
