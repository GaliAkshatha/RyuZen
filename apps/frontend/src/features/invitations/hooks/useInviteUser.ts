import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { invitationService } from "@/features/invitations/services/invitation.service";
import type {
  InvitationResponseDto,
  InviteUserPayload,
} from "@/features/invitations/types/invitation.types";
import { INVITATIONS_QUERY_KEY } from "@/features/invitations/hooks/useInvitations";

export function useInviteUser() {
  const queryClient = useQueryClient();

  return useApiMutation<InvitationResponseDto, InviteUserPayload>({
    mutationFn: invitationService.invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
    },
  });
}
