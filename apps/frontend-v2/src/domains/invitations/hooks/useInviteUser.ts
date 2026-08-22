import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { invitationService } from "@/domains/invitations/invitationService";
import { INVITATIONS_QUERY_KEY } from "@/domains/invitations/hooks/useInvitations";
import type { InviteUserRequest, Invitation } from "@/domains/invitations/invitation.types";

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useApiMutation<Invitation, InviteUserRequest>({
    mutationFn: (payload) => invitationService.invite(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY }),
  });
}
