import { useApiQuery } from "@/hooks/useApiQuery";

import { invitationService } from "@/features/invitations/services/invitation.service";

export const INVITATIONS_QUERY_KEY = ["invitations"] as const;

export function useInvitations() {
  return useApiQuery({
    queryKey: INVITATIONS_QUERY_KEY,
    queryFn: invitationService.list,
  });
}
