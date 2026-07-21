import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  ApplyToPlacementPayload,
  JobApplicationResponseDto,
  UpdateJobApplicationStatusPayload,
} from "@/features/job-applications/types/jobApplication.types";

export const jobApplicationService = {
  apply(placementId: string, payload: ApplyToPlacementPayload): Promise<JobApplicationResponseDto> {
    return apiClient
      .post<JobApplicationResponseDto>(`${API_ENDPOINTS.applications}/${placementId}`, payload)
      .then((response) => response.data);
  },

  /** STUDENT-only self-service. */
  listMine(): Promise<JobApplicationResponseDto[]> {
    return apiClient
      .get<JobApplicationResponseDto[]>(`${API_ENDPOINTS.applications}/me`)
      .then((response) => response.data);
  },

  /** ORG_ADMIN-only review queue for a specific drive. */
  listForPlacement(placementId: string): Promise<JobApplicationResponseDto[]> {
    return apiClient
      .get<JobApplicationResponseDto[]>(`${API_ENDPOINTS.applications}/placements/${placementId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<JobApplicationResponseDto> {
    return apiClient
      .get<JobApplicationResponseDto>(`${API_ENDPOINTS.applications}/${id}`)
      .then((response) => response.data);
  },

  updateStatus(
    id: string,
    payload: UpdateJobApplicationStatusPayload,
  ): Promise<JobApplicationResponseDto> {
    return apiClient
      .patch<JobApplicationResponseDto>(`${API_ENDPOINTS.applications}/${id}/status`, payload)
      .then((response) => response.data);
  },
};
