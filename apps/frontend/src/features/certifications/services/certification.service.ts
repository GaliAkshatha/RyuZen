import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CertificationResponseDto,
  CreateCertificationPayload,
  UpdateCertificationPayload,
} from "@/features/certifications/types/certification.types";

export const certificationService = {
  /** Implicitly scoped to the caller's own entries. */
  listMine(): Promise<CertificationResponseDto[]> {
    return apiClient
      .get<CertificationResponseDto[]>(API_ENDPOINTS.certifications)
      .then((response) => response.data);
  },

  listForUser(userId: string): Promise<CertificationResponseDto[]> {
    return apiClient
      .get<CertificationResponseDto[]>(`${API_ENDPOINTS.certifications}/users/${userId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<CertificationResponseDto> {
    return apiClient
      .get<CertificationResponseDto>(`${API_ENDPOINTS.certifications}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateCertificationPayload): Promise<CertificationResponseDto> {
    return apiClient
      .post<CertificationResponseDto>(API_ENDPOINTS.certifications, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateCertificationPayload): Promise<CertificationResponseDto> {
    return apiClient
      .patch<CertificationResponseDto>(`${API_ENDPOINTS.certifications}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.certifications}/${id}`)
      .then((response) => response.data);
  },
};
