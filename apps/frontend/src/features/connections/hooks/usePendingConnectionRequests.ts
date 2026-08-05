import { useApiQuery } from "@/hooks/useApiQuery";

import { connectionService } from "@/features/connections/services/connection.service";

export const PENDING_REQUESTS_QUERY_KEY = ["connections", "requests", "pending"] as const;

export function usePendingConnectionRequests() {
  return useApiQuery({
    queryKey: PENDING_REQUESTS_QUERY_KEY,
    queryFn: connectionService.getPendingRequests,
  });
}
