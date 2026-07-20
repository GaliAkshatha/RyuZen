import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AwardBadgePayload,
  BadgeResponseDto,
  CreateBadgePayload,
  StudentBadgeResponseDto,
  UpdateBadgePayload,
} from "@/features/badges/types/badge.types";

export const badgeService = {
  list(): Promise<BadgeResponseDto[]> {
    return apiClient
      .get<BadgeResponseDto[]>(API_ENDPOINTS.badges)
      .then((response) => response.data);
  },

  getById(id: string): Promise<BadgeResponseDto> {
    return apiClient
      .get<BadgeResponseDto>(`${API_ENDPOINTS.badges}/${id}`)
      .then((response) => response.data);
  },

  listForStudent(studentId: string): Promise<StudentBadgeResponseDto[]> {
    return apiClient
      .get<StudentBadgeResponseDto[]>(`${API_ENDPOINTS.badges}/students/${studentId}`)
      .then((response) => response.data);
  },

  create(payload: CreateBadgePayload): Promise<BadgeResponseDto> {
    return apiClient
      .post<BadgeResponseDto>(API_ENDPOINTS.badges, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateBadgePayload): Promise<BadgeResponseDto> {
    return apiClient
      .patch<BadgeResponseDto>(`${API_ENDPOINTS.badges}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.badges}/${id}`)
      .then((response) => response.data);
  },

  award(id: string, payload: AwardBadgePayload): Promise<StudentBadgeResponseDto> {
    return apiClient
      .post<StudentBadgeResponseDto>(`${API_ENDPOINTS.badges}/${id}/award`, payload)
      .then((response) => response.data);
  },
};
