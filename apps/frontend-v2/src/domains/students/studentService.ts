import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  AssignMentorRequest,
} from "@/domains/students/student.types";

/** Every call maps 1:1 to a real, confirmed SUPER_ADMIN/ORG_ADMIN route (student.routes.ts). No DELETE - students are archived, never deleted, same real business rule as Faculty. Bulk import deliberately not wrapped here - a genuinely separate file-upload feature, not built this pass. */
export const studentService = {
  async list(): Promise<Student[]> {
    const res = await apiClient.get<ApiSuccessResponse<Student[]>>("/students");
    return res.data.data;
  },

  async getById(id: string): Promise<Student> {
    const res = await apiClient.get<ApiSuccessResponse<Student>>(`/students/${id}`);
    return res.data.data;
  },

  async create(payload: CreateStudentRequest): Promise<Student> {
    const res = await apiClient.post<ApiSuccessResponse<Student>>("/students", payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateStudentRequest): Promise<Student> {
    const res = await apiClient.patch<ApiSuccessResponse<Student>>(`/students/${id}`, payload);
    return res.data.data;
  },

  async assignMentor(id: string, payload: AssignMentorRequest): Promise<Student> {
    const res = await apiClient.patch<ApiSuccessResponse<Student>>(`/students/${id}/mentor`, payload);
    return res.data.data;
  },

  /** No body - confirmed directly against PromoteSemesterUseCase's real signature (id + organizationId only). */
  async promoteSemester(id: string): Promise<Student> {
    const res = await apiClient.patch<ApiSuccessResponse<Student>>(`/students/${id}/promote`);
    return res.data.data;
  },

  /** No body - confirmed directly against ArchiveStudentUseCase. */
  async archive(id: string): Promise<Student> {
    const res = await apiClient.patch<ApiSuccessResponse<Student>>(`/students/${id}/archive`);
    return res.data.data;
  },
};
