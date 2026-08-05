import { useApiMutation } from "@/hooks/useApiMutation";

import { authService } from "@/features/auth/services/auth.service";
import type { AcceptInvitationPayload } from "@/features/auth/types/auth.types";

export function useAcceptInvitation() {
  return useApiMutation<null, AcceptInvitationPayload>({
    mutationFn: authService.acceptInvitation,
  });
}
