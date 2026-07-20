import { useApiMutation } from "@/hooks/useApiMutation";

import { authService } from "@/features/auth/services/auth.service";
import type { RegisterPayload, RegisterUserResponseDto } from "@/features/auth/types/auth.types";

/**
 * A real mutation (unlike useLogin, which wraps AuthContext) since
 * registration does not touch session state at all — confirmed against
 * the backend, RegisterUserResponseDto has no tokens. The user must
 * separately log in afterward.
 */
export function useRegister() {
  return useApiMutation<RegisterUserResponseDto, RegisterPayload>({
    mutationFn: authService.register,
  });
}
