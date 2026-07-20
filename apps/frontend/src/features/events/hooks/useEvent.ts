import { useApiQuery } from "@/hooks/useApiQuery";

import { eventService } from "@/features/events/services/event.service";

export function useEvent(id: string) {
  return useApiQuery({
    queryKey: ["events", id] as const,
    queryFn: () => eventService.getById(id),
    enabled: Boolean(id),
  });
}
