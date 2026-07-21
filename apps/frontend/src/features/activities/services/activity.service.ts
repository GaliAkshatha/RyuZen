import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  ActivityListFilters,
  ActivityResponseDto,
  CreateActivityPayload,
  UpdateActivityPayload,
} from "@/features/activities/types/activity.types";

export const activityService = {
  list(filters?: ActivityListFilters): Promise<ActivityResponseDto[]> {
    return apiClient
      .get<ActivityResponseDto[]>(API_ENDPOINTS.activities, { params: filters })
      .then((response) => response.data);
  },

  getById(id: string): Promise<ActivityResponseDto> {
    return apiClient
      .get<ActivityResponseDto>(`${API_ENDPOINTS.activities}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateActivityPayload): Promise<ActivityResponseDto> {
    return apiClient
      .post<ActivityResponseDto>(API_ENDPOINTS.activities, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateActivityPayload): Promise<ActivityResponseDto> {
    return apiClient
      .patch<ActivityResponseDto>(`${API_ENDPOINTS.activities}/${id}`, payload)
      .then((response) => response.data);
  },

  publish(id: string): Promise<ActivityResponseDto> {
    return apiClient
      .patch<ActivityResponseDto>(`${API_ENDPOINTS.activities}/${id}/publish`, {})
      .then((response) => response.data);
  },

  close(id: string): Promise<ActivityResponseDto> {
    return apiClient
      .patch<ActivityResponseDto>(`${API_ENDPOINTS.activities}/${id}/close`, {})
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.activities}/${id}`)
      .then((response) => response.data);
  },
};
