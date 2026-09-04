import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { eventService } from "@/domains/events/eventService";
import type { CampusEvent } from "@/domains/events/event.types";

export const EVENTS_QUERY_KEY = ["events"] as const;

export function useEvents() {
  return useApiQuery<CampusEvent[]>({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: eventService.list,
  });
}
