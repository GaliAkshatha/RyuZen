import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { invitationService } from "@/domains/invitations/invitationService";
import { INVITATIONS_QUERY_KEY } from "@/domains/invitations/hooks/useInvitations";
import type { Invitation } from "@/domains/invitations/invitation.types";

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useApiMutation<Invitation, string>({
    mutationFn: (id) => invitationService.revoke(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY }),
  });
}
