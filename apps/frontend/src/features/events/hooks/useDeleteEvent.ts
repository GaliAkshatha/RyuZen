import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { eventService } from "@/features/events/services/event.service";
import { EVENTS_QUERY_KEY } from "@/features/events/hooks/useEvents";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => eventService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
}
