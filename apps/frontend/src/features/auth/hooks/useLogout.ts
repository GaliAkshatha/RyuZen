import { useCallback } from "react";
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
 */
export function useLogout(): () => void {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(() => {
    logout();
    queryClient.clear();
  }, [logout, queryClient]);
}
