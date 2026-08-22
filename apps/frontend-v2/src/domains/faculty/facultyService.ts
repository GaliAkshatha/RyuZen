import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Faculty,
  CreateFacultyRequest,
  UpdateFacultyRequest,
  AssignFacultyDepartmentRequest,
} from "@/domains/faculty/faculty.types";

/** Every call maps 1:1 to a real, confirmed SUPER_ADMIN/ORG_ADMIN route (faculty.routes.ts). No DELETE exists - faculty are deactivated, never deleted, a real business rule. */
export const facultyService = {
  async list(): Promise<Faculty[]> {
    const res = await apiClient.get<ApiSuccessResponse<Faculty[]>>("/faculty");
    return res.data.data;
  },

  async getById(id: string): Promise<Faculty> {
    const res = await apiClient.get<ApiSuccessResponse<Faculty>>(`/faculty/${id}`);
    return res.data.data;
  },

  async create(payload: CreateFacultyRequest): Promise<Faculty> {
    const res = await apiClient.post<ApiSuccessResponse<Faculty>>("/faculty", payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateFacultyRequest): Promise<Faculty> {
    const res = await apiClient.patch<ApiSuccessResponse<Faculty>>(`/faculty/${id}`, payload);
    return res.data.data;
  },

  async assignDepartment(id: string, payload: AssignFacultyDepartmentRequest): Promise<Faculty> {
    const res = await apiClient.patch<ApiSuccessResponse<Faculty>>(`/faculty/${id}/department`, payload);
    return res.data.data;
  },

  async deactivate(id: string): Promise<Faculty> {
    const res = await apiClient.patch<ApiSuccessResponse<Faculty>>(`/faculty/${id}/deactivate`);
    return res.data.data;
  },
};
