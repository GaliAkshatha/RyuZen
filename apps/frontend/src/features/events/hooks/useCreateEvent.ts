import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { eventService } from "@/features/events/services/event.service";
import { EVENTS_QUERY_KEY } from "@/features/events/hooks/useEvents";
import type { CreateEventPayload, EventResponseDto } from "@/features/events/types/event.types";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useApiMutation<EventResponseDto, CreateEventPayload>({
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
}
