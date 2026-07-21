import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AchievementResponseDto,
  CreateAchievementPayload,
  UpdateAchievementPayload,
} from "@/features/achievements/types/achievement.types";

export const achievementService = {
  /** SUPER_ADMIN + ORG_ADMIN + FACULTY only — full org-wide review queue. */
  list(): Promise<AchievementResponseDto[]> {
    return apiClient
      .get<AchievementResponseDto[]>(API_ENDPOINTS.achievements)
      .then((response) => response.data);
  },

  /** STUDENT-only self-service. */
  listMine(): Promise<AchievementResponseDto[]> {
    return apiClient
      .get<AchievementResponseDto[]>(`${API_ENDPOINTS.achievements}/me`)
      .then((response) => response.data);
  },

  listForStudent(studentId: string): Promise<AchievementResponseDto[]> {
    return apiClient
      .get<AchievementResponseDto[]>(`${API_ENDPOINTS.achievements}/students/${studentId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<AchievementResponseDto> {
    return apiClient
      .get<AchievementResponseDto>(`${API_ENDPOINTS.achievements}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateAchievementPayload): Promise<AchievementResponseDto> {
    return apiClient
      .post<AchievementResponseDto>(API_ENDPOINTS.achievements, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateAchievementPayload): Promise<AchievementResponseDto> {
    return apiClient
      .patch<AchievementResponseDto>(`${API_ENDPOINTS.achievements}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.achievements}/${id}`)
      .then((response) => response.data);
  },

  verify(id: string): Promise<AchievementResponseDto> {
    return apiClient
      .patch<AchievementResponseDto>(`${API_ENDPOINTS.achievements}/${id}/verify`, {})
      .then((response) => response.data);
  },

  reject(id: string): Promise<AchievementResponseDto> {
    return apiClient
      .patch<AchievementResponseDto>(`${API_ENDPOINTS.achievements}/${id}/reject`, {})
      .then((response) => response.data);
  },
};
