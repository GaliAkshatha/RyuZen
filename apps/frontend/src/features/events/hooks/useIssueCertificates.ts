import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { eventService } from "@/features/events/services/event.service";
import type { EventRegistrationResponseDto } from "@/features/events/types/event.types";

export function useIssueCertificates(eventId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<EventRegistrationResponseDto[], void>({
    mutationFn: () => eventService.issueCertificates(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "registrations"] });
    },
  });
}
