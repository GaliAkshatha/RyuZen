import { useApiMutation } from "@/hooks/useApiMutation";

import { eventService } from "@/features/events/services/event.service";
import type {
  EventRegistrationResponseDto,
  SubmitEventFeedbackPayload,
} from "@/features/events/types/event.types";

export function useSubmitEventFeedback(eventId: string) {
  return useApiMutation<EventRegistrationResponseDto, SubmitEventFeedbackPayload>({
    mutationFn: (payload) => eventService.submitFeedback(eventId, payload),
  });
}
