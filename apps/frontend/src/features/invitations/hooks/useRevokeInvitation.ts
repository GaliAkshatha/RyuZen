import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { invitationService } from "@/features/invitations/services/invitation.service";
import { INVITATIONS_QUERY_KEY } from "@/features/invitations/hooks/useInvitations";

export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => invitationService.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
    },
  });
}
