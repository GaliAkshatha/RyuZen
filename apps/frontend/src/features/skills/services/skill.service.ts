import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreateSkillPayload,
  SkillResponseDto,
  UpdateSkillPayload,
} from "@/features/skills/types/skill.types";

export const skillService = {
  /** Implicitly scoped to the caller's own skills — "List My Skills" per the backend route comment. */
  listMine(): Promise<SkillResponseDto[]> {
    return apiClient
      .get<SkillResponseDto[]>(API_ENDPOINTS.skills)
      .then((response) => response.data);
  },

  listForUser(userId: string): Promise<SkillResponseDto[]> {
    return apiClient
      .get<SkillResponseDto[]>(`${API_ENDPOINTS.skills}/users/${userId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<SkillResponseDto> {
    return apiClient
      .get<SkillResponseDto>(`${API_ENDPOINTS.skills}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateSkillPayload): Promise<SkillResponseDto> {
    return apiClient
      .post<SkillResponseDto>(API_ENDPOINTS.skills, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateSkillPayload): Promise<SkillResponseDto> {
    return apiClient
      .patch<SkillResponseDto>(`${API_ENDPOINTS.skills}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.skills}/${id}`)
      .then((response) => response.data);
  },

  verify(id: string): Promise<SkillResponseDto> {
    return apiClient
      .patch<SkillResponseDto>(`${API_ENDPOINTS.skills}/${id}/verify`, {})
      .then((response) => response.data);
  },
};
