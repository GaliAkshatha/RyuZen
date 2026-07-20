import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { clubService } from "@/features/clubs/services/club.service";

export function useRemoveClubMember(clubId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (memberId) => clubService.removeMember(clubId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs", clubId, "members"] });
    },
  });
}
