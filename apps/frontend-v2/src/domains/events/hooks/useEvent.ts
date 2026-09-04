import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { eventService } from "@/domains/events/eventService";
import type { CampusEvent } from "@/domains/events/event.types";

export function useEvent(id: string) {
  return useApiQuery<CampusEvent>({
    queryKey: ["events", id] as const,
    queryFn: () => eventService.getById(id),
    enabled: Boolean(id),
  });
}
