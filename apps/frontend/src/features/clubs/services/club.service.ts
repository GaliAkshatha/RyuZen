import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AddClubMemberPayload,
  AssignAdvisorPayload,
  ClubMemberResponseDto,
  ClubResponseDto,
  CreateClubPayload,
  UpdateClubPayload,
} from "@/features/clubs/types/club.types";

export const clubService = {
  list(): Promise<ClubResponseDto[]> {
    return apiClient.get<ClubResponseDto[]>(API_ENDPOINTS.clubs).then((response) => response.data);
  },

  getById(id: string): Promise<ClubResponseDto> {
    return apiClient
      .get<ClubResponseDto>(`${API_ENDPOINTS.clubs}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateClubPayload): Promise<ClubResponseDto> {
    return apiClient
      .post<ClubResponseDto>(API_ENDPOINTS.clubs, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateClubPayload): Promise<ClubResponseDto> {
    return apiClient
      .patch<ClubResponseDto>(`${API_ENDPOINTS.clubs}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient.delete<null>(`${API_ENDPOINTS.clubs}/${id}`).then((response) => response.data);
  },

  assignAdvisor(id: string, payload: AssignAdvisorPayload): Promise<ClubResponseDto> {
    return apiClient
      .patch<ClubResponseDto>(`${API_ENDPOINTS.clubs}/${id}/advisor`, payload)
      .then((response) => response.data);
  },

  listMembers(id: string): Promise<ClubMemberResponseDto[]> {
    return apiClient
      .get<ClubMemberResponseDto[]>(`${API_ENDPOINTS.clubs}/${id}/members`)
      .then((response) => response.data);
  },

  addMember(id: string, payload: AddClubMemberPayload): Promise<ClubMemberResponseDto> {
    return apiClient
      .post<ClubMemberResponseDto>(`${API_ENDPOINTS.clubs}/${id}/members`, payload)
      .then((response) => response.data);
  },

  removeMember(id: string, memberId: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.clubs}/${id}/members/${memberId}`)
      .then((response) => response.data);
  },
};
