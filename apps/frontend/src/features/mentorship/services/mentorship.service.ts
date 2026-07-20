import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  MentorshipListFilters,
  MentorshipResponseDto,
  UpdateMentorshipPayload,
} from "@/features/mentorship/types/mentorship.types";

export const mentorshipService = {
  list(filters?: MentorshipListFilters): Promise<MentorshipResponseDto[]> {
    return apiClient
      .get<MentorshipResponseDto[]>(API_ENDPOINTS.mentorships, { params: filters })
      .then((response) => response.data);
  },

  getById(id: string): Promise<MentorshipResponseDto> {
    return apiClient
      .get<MentorshipResponseDto>(`${API_ENDPOINTS.mentorships}/${id}`)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateMentorshipPayload): Promise<MentorshipResponseDto> {
    return apiClient
      .patch<MentorshipResponseDto>(`${API_ENDPOINTS.mentorships}/${id}`, payload)
      .then((response) => response.data);
  },

  complete(id: string): Promise<MentorshipResponseDto> {
    return apiClient
      .patch<MentorshipResponseDto>(`${API_ENDPOINTS.mentorships}/${id}/complete`, {})
      .then((response) => response.data);
  },

  cancel(id: string): Promise<MentorshipResponseDto> {
    return apiClient
      .patch<MentorshipResponseDto>(`${API_ENDPOINTS.mentorships}/${id}/cancel`, {})
      .then((response) => response.data);
  },
};
