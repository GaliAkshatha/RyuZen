import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreateExperiencePayload,
  ExperienceResponseDto,
  UpdateExperiencePayload,
} from "@/features/experience/types/experience.types";

export const experienceService = {
  /** Implicitly scoped to the caller's own entries. */
  listMine(): Promise<ExperienceResponseDto[]> {
    return apiClient
      .get<ExperienceResponseDto[]>(API_ENDPOINTS.experience)
      .then((response) => response.data);
  },

  listForUser(userId: string): Promise<ExperienceResponseDto[]> {
    return apiClient
      .get<ExperienceResponseDto[]>(`${API_ENDPOINTS.experience}/users/${userId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<ExperienceResponseDto> {
    return apiClient
      .get<ExperienceResponseDto>(`${API_ENDPOINTS.experience}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateExperiencePayload): Promise<ExperienceResponseDto> {
    return apiClient
      .post<ExperienceResponseDto>(API_ENDPOINTS.experience, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateExperiencePayload): Promise<ExperienceResponseDto> {
    return apiClient
      .patch<ExperienceResponseDto>(`${API_ENDPOINTS.experience}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.experience}/${id}`)
      .then((response) => response.data);
  },
};
