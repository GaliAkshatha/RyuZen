import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  ConnectableUserResponseDto,
  ConnectionRequestResponseDto,
  ConnectionResponseDto,
  SendConnectionRequestPayload,
  RespondToConnectionRequestPayload,
} from "@/features/connections/types/connection.types";

export const connectionService = {
  /** Real people in your own organization only - never includes email/phone, confirmed against the backend directly. */
  getPeople(): Promise<ConnectableUserResponseDto[]> {
    return apiClient
      .get<ConnectableUserResponseDto[]>(`${API_ENDPOINTS.connections}/people`)
      .then((response) => response.data);
  },

  sendRequest(payload: SendConnectionRequestPayload): Promise<ConnectionRequestResponseDto> {
    return apiClient
      .post<ConnectionRequestResponseDto>(`${API_ENDPOINTS.connections}/requests`, payload)
      .then((response) => response.data);
  },

  respond(
    requestId: string,
    payload: RespondToConnectionRequestPayload,
  ): Promise<ConnectionRequestResponseDto> {
    return apiClient
      .patch<ConnectionRequestResponseDto>(
        `${API_ENDPOINTS.connections}/requests/${requestId}`,
        payload,
      )
      .then((response) => response.data);
  },

  getPendingRequests(): Promise<ConnectionRequestResponseDto[]> {
    return apiClient
      .get<ConnectionRequestResponseDto[]>(`${API_ENDPOINTS.connections}/requests/pending`)
      .then((response) => response.data);
  },

  getMyConnections(): Promise<ConnectionResponseDto[]> {
    return apiClient
      .get<ConnectionResponseDto[]>(`${API_ENDPOINTS.connections}/me`)
      .then((response) => response.data);
  },
};
