import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { authService } from "@/features/auth/services/auth.service";
import { MY_SESSIONS_QUERY_KEY } from "@/features/auth/hooks/useMySessions";

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => authService.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SESSIONS_QUERY_KEY });
    },
  });
}
