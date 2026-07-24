import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";

/**
 * Logout has no backend call to make — confirmed against the real
 * backend source, there is no logout endpoint anywhere on the auth
 * router. This is deliberately a plain callback, not a TanStack
 * mutation, since there is nothing asynchronous to track.
 *
 * Beyond AuthContext's own token/session cleanup, this also clears the
 * entire TanStack Query cache, so no other user's cached data (activity
 * lists, notifications, anything organization-scoped) can leak into the
 * next person's session on a shared device.
 *
 * Navigates to "/" (the Landing Page) explicitly, rather than relying
 * on ProtectedRoute's fallback redirect to "/login" — that fallback is
 * correct for someone hitting a deep authenticated link while signed
 * out (they need the return-to state to get back where they were
 * going), but an intentional logout is a different action and should
 * land somewhere different: back at the start of the experience, not
 * straight at a login form.
 */
export function useLogout(): () => void {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useCallback(() => {
    logout();
    queryClient.clear();
    navigate("/", { replace: true });
  }, [logout, queryClient, navigate]);
}
