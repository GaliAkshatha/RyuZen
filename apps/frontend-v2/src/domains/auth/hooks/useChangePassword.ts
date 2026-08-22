import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { authService } from "@/domains/auth/authService";

export function useChangePassword() {
  return useApiMutation<void, { currentPassword: string; newPassword: string }>({
    mutationFn: (payload) => authService.changePassword(payload),
  });
}
