import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  AssignMentorRequest,
  BulkImportReport,
} from "@/domains/students/student.types";

/** Every call maps 1:1 to a real, confirmed SUPER_ADMIN/ORG_ADMIN route (student.routes.ts). No DELETE - students are archived, never deleted, same real business rule as Faculty. */
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

  /**
   * Real multipart CSV upload (confirmed: csvUpload.single("file") on
   * the backend, field name "file", no JSON body). Content-Type is
   * explicitly cleared here - apiClient's instance-level default
   * (application/json) would otherwise persist and break the
   * multipart boundary axios's FormData auto-detection would
   * otherwise set correctly.
   */
  async bulkImport(file: File): Promise<BulkImportReport> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<ApiSuccessResponse<BulkImportReport>>("/students/bulk-import", formData, {
      headers: { "Content-Type": undefined },
    });
    return res.data.data;
  },
};
