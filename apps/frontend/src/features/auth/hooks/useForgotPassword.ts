import { useApiMutation } from "@/hooks/useApiMutation";

import { authService } from "@/features/auth/services/auth.service";
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponseDto,
} from "@/features/auth/types/auth.types";

export function useForgotPassword() {
  return useApiMutation<ForgotPasswordResponseDto, ForgotPasswordPayload>({
    mutationFn: authService.forgotPassword,
  });
}
