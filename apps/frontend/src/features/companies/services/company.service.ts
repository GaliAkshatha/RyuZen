import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CompanyResponseDto,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  UpdateCompanyStatusPayload,
} from "@/features/companies/types/company.types";

export const companyService = {
  list(): Promise<CompanyResponseDto[]> {
    return apiClient
      .get<CompanyResponseDto[]>(API_ENDPOINTS.companies)
      .then((response) => response.data);
  },

  getById(id: string): Promise<CompanyResponseDto> {
    return apiClient
      .get<CompanyResponseDto>(`${API_ENDPOINTS.companies}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateCompanyPayload): Promise<CompanyResponseDto> {
    return apiClient
      .post<CompanyResponseDto>(API_ENDPOINTS.companies, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateCompanyPayload): Promise<CompanyResponseDto> {
    return apiClient
      .patch<CompanyResponseDto>(`${API_ENDPOINTS.companies}/${id}`, payload)
      .then((response) => response.data);
  },

  updateStatus(id: string, payload: UpdateCompanyStatusPayload): Promise<CompanyResponseDto> {
    return apiClient
      .patch<CompanyResponseDto>(`${API_ENDPOINTS.companies}/${id}/status`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.companies}/${id}`)
      .then((response) => response.data);
  },
};
