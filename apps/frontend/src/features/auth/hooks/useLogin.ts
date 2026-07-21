import { useApiMutation } from "@/hooks/useApiMutation";

import { useAuth } from "@/contexts/AuthContext";
import type { LoginCredentials } from "@/features/auth/types/auth.types";

/**
 * Wraps AuthContext's `login` as a mutation so P1's login page gets
 * `isPending`/`isError`/`error` for free, without AuthContext itself
 * needing to track loading state.
 */
export function useLogin() {
  const { login } = useAuth();

  return useApiMutation<void, LoginCredentials>({
    mutationFn: login,
  });
}
