import { useApiQuery } from "@/hooks/useApiQuery";

import { authService } from "@/features/auth/services/auth.service";
import type { ProfileResponseDto } from "@/features/auth/types/auth.types";

export const CURRENT_USER_QUERY_KEY = ["auth", "currentUser"] as const;

/**
 * The hydration query. AuthContext uses this internally to fetch the
 * canonical "current user" (ProfileResponseDto) whenever a token might
 * be present. `enabled` is controlled by the caller (AuthContext) rather
 * than defaulting to true, since this must not fire before AuthContext
 * has finished checking localStorage for a stored token.
 *
 * Retries are disabled here deliberately: a 401 on this query is handled
 * by apiClient's registered refresh-and-retry flow (see AuthContext),
 * not by TanStack Query's own retry mechanism — retrying at both layers
 * would race.
 */
export function useCurrentUser(enabled: boolean) {
  return useApiQuery<ProfileResponseDto, typeof CURRENT_USER_QUERY_KEY>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: authService.getProfile,
    enabled,
    retry: false,
  });
}
