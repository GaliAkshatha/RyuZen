import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Skill, CreateSkillRequest } from "@/domains/skills/skill.types";

/** Every call here is STUDENT-only on the real backend, matching skill.routes.ts exactly (verify is FACULTY/ORG_ADMIN/SUPER_ADMIN, handled separately). */
export const skillService = {
  async list(): Promise<Skill[]> {
    const res = await apiClient.get<ApiSuccessResponse<Skill[]>>("/skills");
    return res.data.data;
  },

  async listPending(): Promise<Skill[]> {
    const res = await apiClient.get<ApiSuccessResponse<Skill[]>>("/skills/suggestions/pending");
    return res.data.data;
  },

  async create(payload: CreateSkillRequest): Promise<Skill> {
    const res = await apiClient.post<ApiSuccessResponse<Skill>>("/skills", payload);
    return res.data.data;
  },

  async extract(): Promise<Skill[]> {
    const res = await apiClient.post<ApiSuccessResponse<Skill[]>>("/skills/extract");
    return res.data.data;
  },

  async approve(id: string): Promise<Skill> {
    const res = await apiClient.patch<ApiSuccessResponse<Skill>>(`/skills/${id}/approve`);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(`/skills/${id}`);
  },
};
