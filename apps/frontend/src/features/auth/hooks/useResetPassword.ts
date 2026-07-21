import { useApiMutation } from "@/hooks/useApiMutation";

import { authService } from "@/features/auth/services/auth.service";
import type { ResetPasswordPayload } from "@/features/auth/types/auth.types";

export function useResetPassword() {
  return useApiMutation<null, ResetPasswordPayload>({
    mutationFn: authService.resetPassword,
  });
}
