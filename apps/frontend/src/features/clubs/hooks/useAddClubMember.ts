import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { clubService } from "@/features/clubs/services/club.service";
import type {
  AddClubMemberPayload,
  ClubMemberResponseDto,
} from "@/features/clubs/types/club.types";

export function useAddClubMember(clubId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ClubMemberResponseDto, AddClubMemberPayload>({
    mutationFn: (payload) => clubService.addMember(clubId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs", clubId, "members"] });
    },
  });
}
