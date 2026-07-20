import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreateEventPayload,
  EventRegistrationResponseDto,
  EventResponseDto,
  UpdateEventPayload,
} from "@/features/events/types/event.types";

/**
 * Deliberately does not include MarkAttendance, SubmitFeedback, or
 * IssueCertificates — those are C3 (Event Attendance)'s scope, even
 * though they live in the same backend controller/router.
 */
export const eventService = {
  list(): Promise<EventResponseDto[]> {
    return apiClient
      .get<EventResponseDto[]>(API_ENDPOINTS.events)
      .then((response) => response.data);
  },

  getById(id: string): Promise<EventResponseDto> {
    return apiClient
      .get<EventResponseDto>(`${API_ENDPOINTS.events}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateEventPayload): Promise<EventResponseDto> {
    return apiClient
      .post<EventResponseDto>(API_ENDPOINTS.events, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateEventPayload): Promise<EventResponseDto> {
    return apiClient
      .patch<EventResponseDto>(`${API_ENDPOINTS.events}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.events}/${id}`)
      .then((response) => response.data);
  },

  publish(id: string): Promise<EventResponseDto> {
    return apiClient
      .patch<EventResponseDto>(`${API_ENDPOINTS.events}/${id}/publish`, {})
      .then((response) => response.data);
  },

  register(id: string): Promise<EventRegistrationResponseDto> {
    return apiClient
      .post<EventRegistrationResponseDto>(`${API_ENDPOINTS.events}/${id}/register`, {})
      .then((response) => response.data);
  },

  listRegistrations(id: string): Promise<EventRegistrationResponseDto[]> {
    return apiClient
      .get<EventRegistrationResponseDto[]>(`${API_ENDPOINTS.events}/${id}/registrations`)
      .then((response) => response.data);
  },
};
