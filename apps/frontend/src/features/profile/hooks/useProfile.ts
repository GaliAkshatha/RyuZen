import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

/**
 * ProfilePage is only reachable via ProtectedRoute, so the user is
 * always authenticated here — reuses useCurrentUser (F4) with
 * `enabled: true` unconditionally, sharing its exact query key. This is
 * the same query AuthContext's hydration already populated, so this
 * resolves from cache instantly rather than firing a duplicate request.
 */
export function useProfile() {
  return useCurrentUser(true);
}
