import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { connectionService } from "@/domains/connections/connectionService";
import type { Connection } from "@/domains/connections/connection.types";

export const MY_CONNECTIONS_QUERY_KEY = ["connections", "me"] as const;

export function useMyConnections() {
  return useApiQuery<Connection[]>({
    queryKey: MY_CONNECTIONS_QUERY_KEY,
    queryFn: connectionService.listMyConnections,
  });
}
