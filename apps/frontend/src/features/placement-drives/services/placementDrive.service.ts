import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreatePlacementDrivePayload,
  PlacementDriveResponseDto,
  UpdatePlacementDrivePayload,
} from "@/features/placement-drives/types/placementDrive.types";

export const placementDriveService = {
  list(): Promise<PlacementDriveResponseDto[]> {
    return apiClient
      .get<PlacementDriveResponseDto[]>(API_ENDPOINTS.placementDrives)
      .then((response) => response.data);
  },

  getById(id: string): Promise<PlacementDriveResponseDto> {
    return apiClient
      .get<PlacementDriveResponseDto>(`${API_ENDPOINTS.placementDrives}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreatePlacementDrivePayload): Promise<PlacementDriveResponseDto> {
    return apiClient
      .post<PlacementDriveResponseDto>(API_ENDPOINTS.placementDrives, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdatePlacementDrivePayload): Promise<PlacementDriveResponseDto> {
    return apiClient
      .patch<PlacementDriveResponseDto>(`${API_ENDPOINTS.placementDrives}/${id}`, payload)
      .then((response) => response.data);
  },

  publish(id: string): Promise<PlacementDriveResponseDto> {
    return apiClient
      .patch<PlacementDriveResponseDto>(`${API_ENDPOINTS.placementDrives}/${id}/publish`, {})
      .then((response) => response.data);
  },

  close(id: string): Promise<PlacementDriveResponseDto> {
    return apiClient
      .patch<PlacementDriveResponseDto>(`${API_ENDPOINTS.placementDrives}/${id}/close`, {})
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.placementDrives}/${id}`)
      .then((response) => response.data);
  },
};
