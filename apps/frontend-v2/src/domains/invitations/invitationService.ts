import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Invitation, InviteUserRequest } from "@/domains/invitations/invitation.types";

/** Confirmed ORG_ADMIN/PLACEMENT_ADMIN can create; list/resend/revoke confirmed ORG_ADMIN only. */
export const invitationService = {
  async list(): Promise<Invitation[]> {
    const res = await apiClient.get<ApiSuccessResponse<Invitation[]>>("/invitations");
    return res.data.data;
  },
  async invite(payload: InviteUserRequest): Promise<Invitation> {
    const res = await apiClient.post<ApiSuccessResponse<Invitation>>("/invitations", payload);
    return res.data.data;
  },
  async resend(id: string): Promise<Invitation> {
    const res = await apiClient.post<ApiSuccessResponse<Invitation>>(`/invitations/${id}/resend`);
    return res.data.data;
  },
  async revoke(id: string): Promise<Invitation> {
    const res = await apiClient.post<ApiSuccessResponse<Invitation>>(`/invitations/${id}/revoke`);
    return res.data.data;
  },
};
