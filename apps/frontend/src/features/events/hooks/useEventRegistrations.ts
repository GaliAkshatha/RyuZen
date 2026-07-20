import { useApiQuery } from "@/hooks/useApiQuery";

import { eventService } from "@/features/events/services/event.service";

export function useEventRegistrations(eventId: string) {
  return useApiQuery({
    queryKey: ["events", eventId, "registrations"] as const,
    queryFn: () => eventService.listRegistrations(eventId),
    enabled: Boolean(eventId),
  });
}
