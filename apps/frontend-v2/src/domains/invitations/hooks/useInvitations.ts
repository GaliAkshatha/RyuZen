import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { invitationService } from "@/domains/invitations/invitationService";
import type { Invitation } from "@/domains/invitations/invitation.types";

export const INVITATIONS_QUERY_KEY = ["invitations"] as const;

export function useInvitations() {
  return useApiQuery<Invitation[]>({ queryKey: INVITATIONS_QUERY_KEY, queryFn: invitationService.list });
}
