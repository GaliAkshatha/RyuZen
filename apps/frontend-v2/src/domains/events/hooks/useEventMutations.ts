import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { eventService } from "@/domains/events/eventService";
import { EVENTS_QUERY_KEY } from "@/domains/events/hooks/useEvents";
import type {
  CampusEvent,
  EventRegistration,
  CreateEventRequest,
  UpdateEventRequest,
  MarkAttendanceRequest,
  SubmitEventFeedbackRequest,
} from "@/domains/events/event.types";

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useApiMutation<CampusEvent, CreateEventRequest>({
    mutationFn: (payload) => eventService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY }),
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<CampusEvent, UpdateEventRequest>({
    mutationFn: (payload) => eventService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (id) => eventService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY }),
  });
}

export function usePublishEvent(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<CampusEvent, void>({
    mutationFn: () => eventService.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

export function useRegisterForEvent(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<EventRegistration, void>({
    mutationFn: () => eventService.register(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", id] }),
  });
}

export function useMarkEventAttendance(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<EventRegistration, MarkAttendanceRequest>({
    mutationFn: (payload) => eventService.markAttendance(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", id, "registrations"] }),
  });
}

export function useSubmitEventFeedback(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<EventRegistration, SubmitEventFeedbackRequest>({
    mutationFn: (payload) => eventService.submitFeedback(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", id] }),
  });
}

export function useIssueEventCertificates(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<EventRegistration[], void>({
    mutationFn: () => eventService.issueCertificates(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", id, "registrations"] }),
  });
}
