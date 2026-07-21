import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AlumniResponseDto,
  CreateAlumniPayload,
  InviteAlumniPayload,
  InviteAlumniResponseDto,
  UpdateAlumniPayload,
} from "@/features/alumni/types/alumni.types";

export const alumniService = {
  list(): Promise<AlumniResponseDto[]> {
    return apiClient
      .get<AlumniResponseDto[]>(API_ENDPOINTS.alumni)
      .then((response) => response.data);
  },

  getById(id: string): Promise<AlumniResponseDto> {
    return apiClient
      .get<AlumniResponseDto>(`${API_ENDPOINTS.alumni}/${id}`)
      .then((response) => response.data);
  },

  /**
   * Attaches an Alumni record to an existing user. No dedicated UI in
   * this milestone (see alumni.types.ts) — kept for API-surface
   * completeness and future use, matching the pattern established for
   * every other service in this project of mirroring the backend
   * exactly rather than only what today's pages happen to call.
   */
  create(payload: CreateAlumniPayload): Promise<AlumniResponseDto> {
    return apiClient
      .post<AlumniResponseDto>(API_ENDPOINTS.alumni, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateAlumniPayload): Promise<AlumniResponseDto> {
    return apiClient
      .patch<AlumniResponseDto>(`${API_ENDPOINTS.alumni}/${id}`, payload)
      .then((response) => response.data);
  },

  invite(payload: InviteAlumniPayload): Promise<InviteAlumniResponseDto> {
    return apiClient
      .post<InviteAlumniResponseDto>(`${API_ENDPOINTS.alumni}/invite`, payload)
      .then((response) => response.data);
  },

  verify(id: string): Promise<AlumniResponseDto> {
    return apiClient
      .patch<AlumniResponseDto>(`${API_ENDPOINTS.alumni}/${id}/verify`, {})
      .then((response) => response.data);
  },
};
