import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { connectionService } from "@/domains/connections/connectionService";
import type { ConnectionRequest } from "@/domains/connections/connection.types";

export const PENDING_REQUESTS_QUERY_KEY = ["connections", "requests", "pending"] as const;

export function usePendingRequests() {
  return useApiQuery<ConnectionRequest[]>({
    queryKey: PENDING_REQUESTS_QUERY_KEY,
    queryFn: connectionService.listPendingRequests,
  });
}
