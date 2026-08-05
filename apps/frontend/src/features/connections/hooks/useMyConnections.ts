import { useApiQuery } from "@/hooks/useApiQuery";

import { connectionService } from "@/features/connections/services/connection.service";

export const MY_CONNECTIONS_QUERY_KEY = ["connections", "me"] as const;

export function useMyConnections() {
  return useApiQuery({
    queryKey: MY_CONNECTIONS_QUERY_KEY,
    queryFn: connectionService.getMyConnections,
  });
}
