import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CertificateResponseDto,
  IssueCertificatePayload,
} from "@/features/certificates/types/certificate.types";

export const certificateService = {
  /** STUDENT-only — confirmed this milestone. Declared before /:id on the backend to avoid "me" being captured as a param. */
  getMyCertificates(): Promise<CertificateResponseDto[]> {
    return apiClient
      .get<CertificateResponseDto[]>(`${API_ENDPOINTS.certificates}/me`)
      .then((response) => response.data);
  },

  listForStudent(studentId: string): Promise<CertificateResponseDto[]> {
    return apiClient
      .get<CertificateResponseDto[]>(`${API_ENDPOINTS.certificates}/students/${studentId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<CertificateResponseDto> {
    return apiClient
      .get<CertificateResponseDto>(`${API_ENDPOINTS.certificates}/${id}`)
      .then((response) => response.data);
  },

  issue(payload: IssueCertificatePayload): Promise<CertificateResponseDto> {
    return apiClient
      .post<CertificateResponseDto>(API_ENDPOINTS.certificates, payload)
      .then((response) => response.data);
  },
};
