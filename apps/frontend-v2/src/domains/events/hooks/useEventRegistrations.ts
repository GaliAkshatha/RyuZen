import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { eventService } from "@/domains/events/eventService";
import type { EventRegistration } from "@/domains/events/event.types";

export function useEventRegistrations(id: string) {
  return useApiQuery<EventRegistration[]>({
    queryKey: ["events", id, "registrations"] as const,
    queryFn: () => eventService.listRegistrations(id),
    enabled: Boolean(id),
  });
}
