import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { eventService } from "@/features/events/services/event.service";
import type {
  EventRegistrationResponseDto,
  MarkAttendancePayload,
} from "@/features/events/types/event.types";

export function useMarkAttendance(eventId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<EventRegistrationResponseDto, MarkAttendancePayload>({
    mutationFn: (payload) => eventService.markAttendance(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "registrations"] });
    },
  });
}
