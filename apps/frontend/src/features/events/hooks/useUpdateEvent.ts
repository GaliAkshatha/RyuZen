import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { eventService } from "@/features/events/services/event.service";
import { EVENTS_QUERY_KEY } from "@/features/events/hooks/useEvents";
import type { EventResponseDto, UpdateEventPayload } from "@/features/events/types/event.types";

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<EventResponseDto, UpdateEventPayload>({
    mutationFn: (payload) => eventService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.setQueryData(["events", id], updated);
    },
  });
}
