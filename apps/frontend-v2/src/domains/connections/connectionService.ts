import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  ConnectableUser,
  Connection,
  ConnectionRequest,
  SendConnectionRequestPayload,
  RespondToConnectionRequestPayload,
} from "@/domains/connections/connection.types";

/** Every call maps 1:1 to a real, confirmed route (connection.routes.ts) - open to any authenticated user at the route level; the real ORG_ADMIN/SUPER_ADMIN exclusion happens inside the use cases (confirmed and covered by 5 backend tests from earlier this engagement). */
export const connectionService = {
  async listPeople(): Promise<ConnectableUser[]> {
    const res = await apiClient.get<ApiSuccessResponse<ConnectableUser[]>>("/connections/people");
    return res.data.data;
  },

  async listMyConnections(): Promise<Connection[]> {
    const res = await apiClient.get<ApiSuccessResponse<Connection[]>>("/connections/me");
    return res.data.data;
  },

  async listPendingRequests(): Promise<ConnectionRequest[]> {
    const res = await apiClient.get<ApiSuccessResponse<ConnectionRequest[]>>("/connections/requests/pending");
    return res.data.data;
  },

  async sendRequest(payload: SendConnectionRequestPayload): Promise<ConnectionRequest> {
    const res = await apiClient.post<ApiSuccessResponse<ConnectionRequest>>("/connections/requests", payload);
    return res.data.data;
  },

  async respondToRequest(id: string, payload: RespondToConnectionRequestPayload): Promise<ConnectionRequest> {
    const res = await apiClient.patch<ApiSuccessResponse<ConnectionRequest>>(`/connections/requests/${id}`, payload);
    return res.data.data;
  },
};
