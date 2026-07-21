import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AssignMentorPayload,
  CreateStudentPayload,
  StudentResponseDto,
  UpdateStudentPayload,
} from "@/features/students/types/student.types";

export const studentService = {
  list(): Promise<StudentResponseDto[]> {
    return apiClient
      .get<StudentResponseDto[]>(API_ENDPOINTS.students)
      .then((response) => response.data);
  },

  getById(id: string): Promise<StudentResponseDto> {
    return apiClient
      .get<StudentResponseDto>(`${API_ENDPOINTS.students}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateStudentPayload): Promise<StudentResponseDto> {
    return apiClient
      .post<StudentResponseDto>(API_ENDPOINTS.students, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateStudentPayload): Promise<StudentResponseDto> {
    return apiClient
      .patch<StudentResponseDto>(`${API_ENDPOINTS.students}/${id}`, payload)
      .then((response) => response.data);
  },

  assignMentor(id: string, payload: AssignMentorPayload): Promise<StudentResponseDto> {
    return apiClient
      .patch<StudentResponseDto>(`${API_ENDPOINTS.students}/${id}/mentor`, payload)
      .then((response) => response.data);
  },

  promote(id: string): Promise<StudentResponseDto> {
    return apiClient
      .patch<StudentResponseDto>(`${API_ENDPOINTS.students}/${id}/promote`, {})
      .then((response) => response.data);
  },

  archive(id: string): Promise<StudentResponseDto> {
    return apiClient
      .patch<StudentResponseDto>(`${API_ENDPOINTS.students}/${id}/archive`, {})
      .then((response) => response.data);
  },
};
