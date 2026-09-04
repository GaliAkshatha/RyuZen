import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { CodingProfile, LinkCodingProfileRequest } from "@/domains/coding-profiles/codingProfile.types";

/** Real gap filled: /coding-profiles existed on the backend (link/list-mine/sync, real Codeforces API verification) with zero frontend caller. */
export const codingProfileService = {
  async link(payload: LinkCodingProfileRequest): Promise<CodingProfile> {
    const res = await apiClient.post<ApiSuccessResponse<CodingProfile>>("/coding-profiles", payload);
    return res.data.data;
  },

  async getMine(): Promise<CodingProfile[]> {
    const res = await apiClient.get<ApiSuccessResponse<CodingProfile[]>>("/coding-profiles/me");
    return res.data.data;
  },

  async sync(id: string): Promise<CodingProfile> {
    const res = await apiClient.post<ApiSuccessResponse<CodingProfile>>(`/coding-profiles/${id}/sync`);
    return res.data.data;
  },
};
