import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Badge, StudentBadge, CreateBadgeRequest, UpdateBadgeRequest, AwardBadgeRequest } from "@/domains/badges/badge.types";

/** Real gap filled: /badges existed on the backend (a global catalog + real per-student award records) with zero frontend caller. Create/update/delete are SUPER_ADMIN only; award is SUPER_ADMIN/ORG_ADMIN/FACULTY; list/get/listForStudent are open to any authenticated role. */
export const badgeService = {
  async list(): Promise<Badge[]> {
    const res = await apiClient.get<ApiSuccessResponse<Badge[]>>("/badges");
    return res.data.data;
  },

  async getById(id: string): Promise<Badge> {
    const res = await apiClient.get<ApiSuccessResponse<Badge>>(`/badges/${id}`);
    return res.data.data;
  },

  async listForStudent(studentId: string): Promise<StudentBadge[]> {
    const res = await apiClient.get<ApiSuccessResponse<StudentBadge[]>>(`/badges/students/${studentId}`);
    return res.data.data;
  },

  /** STUDENT-only self-scoped lookup - resolves the caller's own Student record from their real userId server-side. */
  async getMine(): Promise<StudentBadge[]> {
    const res = await apiClient.get<ApiSuccessResponse<StudentBadge[]>>("/badges/me");
    return res.data.data;
  },

  async create(payload: CreateBadgeRequest): Promise<Badge> {
    const res = await apiClient.post<ApiSuccessResponse<Badge>>("/badges", payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateBadgeRequest): Promise<Badge> {
    const res = await apiClient.patch<ApiSuccessResponse<Badge>>(`/badges/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(`/badges/${id}`);
  },

  async award(id: string, payload: AwardBadgeRequest): Promise<StudentBadge> {
    const res = await apiClient.post<ApiSuccessResponse<StudentBadge>>(`/badges/${id}/award`, payload);
    return res.data.data;
  },
};
