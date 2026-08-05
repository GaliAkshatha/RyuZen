import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { invitationService } from "@/features/invitations/services/invitation.service";
import type { InvitationResponseDto } from "@/features/invitations/types/invitation.types";
import { INVITATIONS_QUERY_KEY } from "@/features/invitations/hooks/useInvitations";

export function useResendInvitation() {
  const queryClient = useQueryClient();

  return useApiMutation<InvitationResponseDto, string>({
    mutationFn: (id) => invitationService.resend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
    },
  });
}
