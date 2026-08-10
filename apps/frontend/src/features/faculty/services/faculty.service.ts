import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AssignFacultyDepartmentPayload,
  CreateFacultyPayload,
  FacultyResponseDto,
  UpdateFacultyPayload,
} from "@/features/faculty/types/faculty.types";

export const facultyService = {
  getMe(): Promise<FacultyResponseDto> {
    return apiClient
      .get<FacultyResponseDto>(`${API_ENDPOINTS.faculty}/me`)
      .then((response) => response.data);
  },

  list(): Promise<FacultyResponseDto[]> {
    return apiClient
      .get<FacultyResponseDto[]>(API_ENDPOINTS.faculty)
      .then((response) => response.data);
  },

  getById(id: string): Promise<FacultyResponseDto> {
    return apiClient
      .get<FacultyResponseDto>(`${API_ENDPOINTS.faculty}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateFacultyPayload): Promise<FacultyResponseDto> {
    return apiClient
      .post<FacultyResponseDto>(API_ENDPOINTS.faculty, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateFacultyPayload): Promise<FacultyResponseDto> {
    return apiClient
      .patch<FacultyResponseDto>(`${API_ENDPOINTS.faculty}/${id}`, payload)
      .then((response) => response.data);
  },

  assignDepartment(
    id: string,
    payload: AssignFacultyDepartmentPayload,
  ): Promise<FacultyResponseDto> {
    return apiClient
      .patch<FacultyResponseDto>(`${API_ENDPOINTS.faculty}/${id}/department`, payload)
      .then((response) => response.data);
  },

  deactivate(id: string): Promise<FacultyResponseDto> {
    return apiClient
      .patch<FacultyResponseDto>(`${API_ENDPOINTS.faculty}/${id}/deactivate`, {})
      .then((response) => response.data);
  },
};
