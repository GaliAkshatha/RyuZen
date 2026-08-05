import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { connectionService } from "@/features/connections/services/connection.service";
import { PEOPLE_QUERY_KEY } from "@/features/connections/hooks/usePeople";
import type {
  ConnectionRequestResponseDto,
  SendConnectionRequestPayload,
} from "@/features/connections/types/connection.types";

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useApiMutation<ConnectionRequestResponseDto, SendConnectionRequestPayload>({
    mutationFn: (payload) => connectionService.sendRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEOPLE_QUERY_KEY });
    },
  });
}
