import { useApiQuery } from "@/hooks/useApiQuery";

import { authService } from "@/features/auth/services/auth.service";

export const MY_SESSIONS_QUERY_KEY = ["auth", "sessions"] as const;

export function useMySessions() {
  return useApiQuery({
    queryKey: MY_SESSIONS_QUERY_KEY,
    queryFn: authService.getSessions,
  });
}
