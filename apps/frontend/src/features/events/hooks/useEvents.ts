import { useApiQuery } from "@/hooks/useApiQuery";

import { eventService } from "@/features/events/services/event.service";

export const EVENTS_QUERY_KEY = ["events"] as const;

export function useEvents() {
  return useApiQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: eventService.list,
  });
}
