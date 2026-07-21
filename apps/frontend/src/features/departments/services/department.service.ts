import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AssignHeadOfDepartmentPayload,
  CreateDepartmentPayload,
  DepartmentResponseDto,
  UpdateDepartmentPayload,
} from "@/features/departments/types/department.types";

export const departmentService = {
  list(): Promise<DepartmentResponseDto[]> {
    return apiClient
      .get<DepartmentResponseDto[]>(API_ENDPOINTS.departments)
      .then((response) => response.data);
  },

  getById(id: string): Promise<DepartmentResponseDto> {
    return apiClient
      .get<DepartmentResponseDto>(`${API_ENDPOINTS.departments}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateDepartmentPayload): Promise<DepartmentResponseDto> {
    return apiClient
      .post<DepartmentResponseDto>(API_ENDPOINTS.departments, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateDepartmentPayload): Promise<DepartmentResponseDto> {
    return apiClient
      .patch<DepartmentResponseDto>(`${API_ENDPOINTS.departments}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.departments}/${id}`)
      .then((response) => response.data);
  },

  assignHead(id: string, payload: AssignHeadOfDepartmentPayload): Promise<DepartmentResponseDto> {
    return apiClient
      .patch<DepartmentResponseDto>(`${API_ENDPOINTS.departments}/${id}/head`, payload)
      .then((response) => response.data);
  },
};
