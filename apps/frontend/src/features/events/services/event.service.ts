import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreateEventPayload,
  EventRegistrationResponseDto,
  EventResponseDto,
  MarkAttendancePayload,
  SubmitEventFeedbackPayload,
  UpdateEventPayload,
} from "@/features/events/types/event.types";

/**
 * C2 built list/get/create/update/delete/publish/register/
 * listRegistrations. C3 (this milestone) extends this same file with
 * markAttendance, submitFeedback, and issueCertificates.
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

  markAttendance(
    id: string,
    payload: MarkAttendancePayload,
  ): Promise<EventRegistrationResponseDto> {
    return apiClient
      .patch<EventRegistrationResponseDto>(`${API_ENDPOINTS.events}/${id}/attendance`, payload)
      .then((response) => response.data);
  },

  submitFeedback(
    id: string,
    payload: SubmitEventFeedbackPayload,
  ): Promise<EventRegistrationResponseDto> {
    return apiClient
      .post<EventRegistrationResponseDto>(`${API_ENDPOINTS.events}/${id}/feedback`, payload)
      .then((response) => response.data);
  },

  /** Bulk action — no body. Issues certificates to all attended-but-not-yet-issued registrations for the event. */
  issueCertificates(id: string): Promise<EventRegistrationResponseDto[]> {
    return apiClient
      .post<EventRegistrationResponseDto[]>(`${API_ENDPOINTS.events}/${id}/certificates`, {})
      .then((response) => response.data);
  },
};
