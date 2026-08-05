import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  InvitationResponseDto,
  InviteUserPayload,
} from "@/features/invitations/types/invitation.types";

export const invitationService = {
  list(): Promise<InvitationResponseDto[]> {
    return apiClient
      .get<InvitationResponseDto[]>(API_ENDPOINTS.invitations)
      .then((response) => response.data);
  },

  invite(payload: InviteUserPayload): Promise<InvitationResponseDto> {
    return apiClient
      .post<InvitationResponseDto>(API_ENDPOINTS.invitations, payload)
      .then((response) => response.data);
  },

  resend(id: string): Promise<InvitationResponseDto> {
    return apiClient
      .post<InvitationResponseDto>(`${API_ENDPOINTS.invitations}/${id}/resend`, {})
      .then((response) => response.data);
  },

  revoke(id: string): Promise<null> {
    return apiClient
      .post<null>(`${API_ENDPOINTS.invitations}/${id}/revoke`, {})
      .then((response) => response.data);
  },
};
