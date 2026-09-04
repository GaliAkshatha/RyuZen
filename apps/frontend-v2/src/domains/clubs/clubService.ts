import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Club,
  ClubMember,
  CreateClubRequest,
  UpdateClubRequest,
  AssignAdvisorRequest,
  AddClubMemberRequest,
} from "@/domains/clubs/club.types";

/** Real gap filled: /clubs existed on the backend (9 real routes - catalog CRUD, advisor assignment, admin-managed membership) with zero frontend caller. */
export const clubService = {
  async list(): Promise<Club[]> {
    const res = await apiClient.get<ApiSuccessResponse<Club[]>>("/clubs");
    return res.data.data;
  },

  async getById(id: string): Promise<Club> {
    const res = await apiClient.get<ApiSuccessResponse<Club>>(`/clubs/${id}`);
    return res.data.data;
  },

  async listMembers(id: string): Promise<ClubMember[]> {
    const res = await apiClient.get<ApiSuccessResponse<ClubMember[]>>(`/clubs/${id}/members`);
    return res.data.data;
  },

  async create(payload: CreateClubRequest): Promise<Club> {
    const res = await apiClient.post<ApiSuccessResponse<Club>>("/clubs", payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateClubRequest): Promise<Club> {
    const res = await apiClient.patch<ApiSuccessResponse<Club>>(`/clubs/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(`/clubs/${id}`);
  },

  async assignAdvisor(id: string, payload: AssignAdvisorRequest): Promise<Club> {
    const res = await apiClient.patch<ApiSuccessResponse<Club>>(`/clubs/${id}/advisor`, payload);
    return res.data.data;
  },

  async addMember(id: string, payload: AddClubMemberRequest): Promise<ClubMember> {
    const res = await apiClient.post<ApiSuccessResponse<ClubMember>>(`/clubs/${id}/members`, payload);
    return res.data.data;
  },

  async removeMember(id: string, memberId: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(`/clubs/${id}/members/${memberId}`);
  },
};
