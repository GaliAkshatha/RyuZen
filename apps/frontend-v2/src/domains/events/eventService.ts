import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  CampusEvent,
  EventRegistration,
  CreateEventRequest,
  UpdateEventRequest,
  MarkAttendanceRequest,
  SubmitEventFeedbackRequest,
} from "@/domains/events/event.types";

/** Real gap filled: /events existed on the backend (11 real routes - full event lifecycle, student registration, attendance, feedback, bulk certificate issuance) with zero frontend caller. */
export const eventService = {
  async list(): Promise<CampusEvent[]> {
    const res = await apiClient.get<ApiSuccessResponse<CampusEvent[]>>("/events");
    return res.data.data;
  },

  async getById(id: string): Promise<CampusEvent> {
    const res = await apiClient.get<ApiSuccessResponse<CampusEvent>>(`/events/${id}`);
    return res.data.data;
  },

  async listRegistrations(id: string): Promise<EventRegistration[]> {
    const res = await apiClient.get<ApiSuccessResponse<EventRegistration[]>>(`/events/${id}/registrations`);
    return res.data.data;
  },

  async create(payload: CreateEventRequest): Promise<CampusEvent> {
    const res = await apiClient.post<ApiSuccessResponse<CampusEvent>>("/events", payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateEventRequest): Promise<CampusEvent> {
    const res = await apiClient.patch<ApiSuccessResponse<CampusEvent>>(`/events/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(`/events/${id}`);
  },

  async publish(id: string): Promise<CampusEvent> {
    const res = await apiClient.patch<ApiSuccessResponse<CampusEvent>>(`/events/${id}/publish`);
    return res.data.data;
  },

  async register(id: string): Promise<EventRegistration> {
    const res = await apiClient.post<ApiSuccessResponse<EventRegistration>>(`/events/${id}/register`);
    return res.data.data;
  },

  async markAttendance(id: string, payload: MarkAttendanceRequest): Promise<EventRegistration> {
    const res = await apiClient.patch<ApiSuccessResponse<EventRegistration>>(`/events/${id}/attendance`, payload);
    return res.data.data;
  },

  async submitFeedback(id: string, payload: SubmitEventFeedbackRequest): Promise<EventRegistration> {
    const res = await apiClient.post<ApiSuccessResponse<EventRegistration>>(`/events/${id}/feedback`, payload);
    return res.data.data;
  },

  async issueCertificates(id: string): Promise<EventRegistration[]> {
    const res = await apiClient.post<ApiSuccessResponse<EventRegistration[]>>(`/events/${id}/certificates`);
    return res.data.data;
  },
};
