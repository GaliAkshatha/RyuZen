import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { connectionService } from "@/domains/connections/connectionService";
import { PEOPLE_QUERY_KEY } from "@/domains/connections/hooks/usePeople";
import type { SendConnectionRequestPayload, ConnectionRequest } from "@/domains/connections/connection.types";

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();
  return useApiMutation<ConnectionRequest, SendConnectionRequestPayload>({
    mutationFn: (payload) => connectionService.sendRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEOPLE_QUERY_KEY });
    },
  });
}
