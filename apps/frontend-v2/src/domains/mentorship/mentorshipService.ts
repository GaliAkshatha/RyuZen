import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Mentorship, UpdateMentorshipRequest } from "@/domains/mentorship/mentorship.types";

/**
 * listMine() deliberately sends no facultyId - confirmed this
 * engagement's own earlier security fix: GetMentorshipsUseCase derives
 * facultyId server-side for FACULTY callers regardless of what's
 * requested, closing a real ID-manipulation gap. Passing one from here
 * would be a no-op at best.
 */
export const mentorshipService = {
  async listMine(): Promise<Mentorship[]> {
    const res = await apiClient.get<ApiSuccessResponse<Mentorship[]>>("/mentorships");
    return res.data.data;
  },
  async update(id: string, payload: UpdateMentorshipRequest): Promise<Mentorship> {
    const res = await apiClient.patch<ApiSuccessResponse<Mentorship>>(`/mentorships/${id}`, payload);
    return res.data.data;
  },
  async complete(id: string): Promise<Mentorship> {
    const res = await apiClient.patch<ApiSuccessResponse<Mentorship>>(`/mentorships/${id}/complete`);
    return res.data.data;
  },
};
