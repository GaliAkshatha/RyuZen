import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { connectionService } from "@/features/connections/services/connection.service";
import { PENDING_REQUESTS_QUERY_KEY } from "@/features/connections/hooks/usePendingConnectionRequests";
import { MY_CONNECTIONS_QUERY_KEY } from "@/features/connections/hooks/useMyConnections";
import { PEOPLE_QUERY_KEY } from "@/features/connections/hooks/usePeople";
import type {
  ConnectionRequestResponseDto,
  RespondToConnectionRequestPayload,
} from "@/features/connections/types/connection.types";

export function useRespondToConnectionRequest() {
  const queryClient = useQueryClient();

  return useApiMutation<
    ConnectionRequestResponseDto,
    { requestId: string; payload: RespondToConnectionRequestPayload }
  >({
    mutationFn: ({ requestId, payload }) => connectionService.respond(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_CONNECTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PEOPLE_QUERY_KEY });
    },
  });
}
