import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { connectionService } from "@/domains/connections/connectionService";
import { PENDING_REQUESTS_QUERY_KEY } from "@/domains/connections/hooks/usePendingRequests";
import { MY_CONNECTIONS_QUERY_KEY } from "@/domains/connections/hooks/useMyConnections";
import type { RespondToConnectionRequestPayload, ConnectionRequest } from "@/domains/connections/connection.types";

export function useRespondToConnectionRequest() {
  const queryClient = useQueryClient();
  return useApiMutation<ConnectionRequest, { id: string; payload: RespondToConnectionRequestPayload }>({
    mutationFn: ({ id, payload }) => connectionService.respondToRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_CONNECTIONS_QUERY_KEY });
    },
  });
}
