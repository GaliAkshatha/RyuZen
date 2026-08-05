import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/features/auth/services/auth.service";

/**
 * Now calls the real DELETE-equivalent backend endpoint
 * (POST /auth/logout) before clearing local state - genuinely revokes
 * the session server-side (Session Management), not just makes this
 * browser forget its tokens while the session stays valid server-side
 * indefinitely. This used to be purely client-side, documented at the
 * time as correct because "there is no logout endpoint anywhere on the
 * auth router" - that's no longer true.
 *
 * The backend call is best-effort: if it fails (network issue, token
 * already expired, etc.), local logout still proceeds regardless - a
 * failed server call should never trap someone in a logged-in-looking
 * state on their own device.
 *
 * Beyond AuthContext's own token/session cleanup, this also clears the
 * entire TanStack Query cache, so no other user's cached data can leak
 * into the next person's session on a shared device.
 *
 * Navigates to "/" (the Landing Page) explicitly, rather than relying
 * on ProtectedRoute's fallback redirect to "/login" - an intentional
 * logout should land back at the start of the experience, not
 * straight at a login form.
 */
export function useLogout(): () => void {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useCallback(() => {
    authService.logout().catch(() => {
      // Best-effort - local logout proceeds regardless.
    });
    logout();
    queryClient.clear();
    navigate("/", { replace: true });
  }, [logout, queryClient, navigate]);
}
