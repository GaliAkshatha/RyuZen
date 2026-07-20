import { useQuery } from "@tanstack/react-query";

import { eventService } from "@/features/events/services/event.service";
import { EventStatus } from "@/types/enums";

export interface AttendanceSummary {
  eventCount: number;
  totalRegistered: number;
  totalAttended: number;
}

/**
 * FACULTY can access GET /:id/registrations (unlike STUDENT — see
 * AttendanceWidget.tsx's documented gap), but there's no backend
 * endpoint that aggregates attendance across events in one call. This
 * computes a bounded aggregation client-side: the 5 most recently
 * started PUBLISHED/COMPLETED events, to avoid an unbounded N+1 fetch
 * across every event ever created.
 */
export function useRecentAttendanceSummary() {
  return useQuery({
    queryKey: ["events", "attendance-summary"],
    queryFn: async (): Promise<AttendanceSummary> => {
      const events = await eventService.list();
      const recent = events
        .filter((e) => e.status === EventStatus.PUBLISHED || e.status === EventStatus.COMPLETED)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, 5);

      const registrationLists = await Promise.all(
        recent.map((event) => eventService.listRegistrations(event.id)),
      );

      const totalRegistered = registrationLists.reduce((sum, list) => sum + list.length, 0);
      const totalAttended = registrationLists.reduce(
        (sum, list) => sum + list.filter((r) => r.attendance).length,
        0,
      );

      return { eventCount: recent.length, totalRegistered, totalAttended };
    },
  });
}
