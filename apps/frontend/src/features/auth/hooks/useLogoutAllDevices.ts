import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";
import { useAuth } from "@/contexts/AuthContext";

import { authService } from "@/features/auth/services/auth.service";

/**
 * Revokes EVERY active session, including this one - so on success
 * this also performs the same local cleanup useLogout does (this
 * browser's own session was just revoked too, staying "logged in"
 * locally after this succeeds would be showing a stale, already-dead
 * session).
 */
export function useLogoutAllDevices() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useApiMutation<null, void>({
    mutationFn: () => authService.logoutAllDevices(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/auth/login", { replace: true });
    },
  });
}
