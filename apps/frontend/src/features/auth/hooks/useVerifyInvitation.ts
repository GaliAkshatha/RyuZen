import { useApiMutation } from "@/hooks/useApiMutation";

import { authService } from "@/features/auth/services/auth.service";
import type {
  VerifyInvitationPayload,
  VerifyInvitationResponseDto,
} from "@/features/auth/types/auth.types";

export function useVerifyInvitation() {
  return useApiMutation<VerifyInvitationResponseDto, VerifyInvitationPayload>({
    mutationFn: authService.verifyInvitation,
  });
}
