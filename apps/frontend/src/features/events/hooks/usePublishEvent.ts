import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { eventService } from "@/features/events/services/event.service";
import { EVENTS_QUERY_KEY } from "@/features/events/hooks/useEvents";
import type { EventResponseDto } from "@/features/events/types/event.types";

export function usePublishEvent(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<EventResponseDto, void>({
    mutationFn: () => eventService.publish(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.setQueryData(["events", id], updated);
    },
  });
}
