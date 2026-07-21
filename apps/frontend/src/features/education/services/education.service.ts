import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreateEducationPayload,
  EducationResponseDto,
  UpdateEducationPayload,
} from "@/features/education/types/education.types";

export const educationService = {
  /** Implicitly scoped to the caller's own entries — "List My Education Entries" per the backend route comment. */
  listMine(): Promise<EducationResponseDto[]> {
    return apiClient
      .get<EducationResponseDto[]>(API_ENDPOINTS.education)
      .then((response) => response.data);
  },

  listForUser(userId: string): Promise<EducationResponseDto[]> {
    return apiClient
      .get<EducationResponseDto[]>(`${API_ENDPOINTS.education}/users/${userId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<EducationResponseDto> {
    return apiClient
      .get<EducationResponseDto>(`${API_ENDPOINTS.education}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateEducationPayload): Promise<EducationResponseDto> {
    return apiClient
      .post<EducationResponseDto>(API_ENDPOINTS.education, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateEducationPayload): Promise<EducationResponseDto> {
    return apiClient
      .patch<EducationResponseDto>(`${API_ENDPOINTS.education}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.education}/${id}`)
      .then((response) => response.data);
  },
};
