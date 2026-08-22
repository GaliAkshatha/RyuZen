import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  AssignHeadOfDepartmentRequest,
} from "@/domains/departments/department.types";

/** Every call maps 1:1 to a real, confirmed SUPER_ADMIN/ORG_ADMIN route (department.routes.ts). */
export const departmentService = {
  async list(): Promise<Department[]> {
    const res = await apiClient.get<ApiSuccessResponse<Department[]>>("/departments");
    return res.data.data;
  },

  async getById(id: string): Promise<Department> {
    const res = await apiClient.get<ApiSuccessResponse<Department>>(`/departments/${id}`);
    return res.data.data;
  },

  async create(payload: CreateDepartmentRequest): Promise<Department> {
    const res = await apiClient.post<ApiSuccessResponse<Department>>("/departments", payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateDepartmentRequest): Promise<Department> {
    const res = await apiClient.patch<ApiSuccessResponse<Department>>(`/departments/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/departments/${id}`);
  },

  async assignHead(id: string, payload: AssignHeadOfDepartmentRequest): Promise<Department> {
    const res = await apiClient.patch<ApiSuccessResponse<Department>>(`/departments/${id}/head`, payload);
    return res.data.data;
  },
};
