export type ConnectionStatus = "PENDING_SENT" | "PENDING_RECEIVED" | "ACCEPTED";
export type ConnectionRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

/** Mirrors ConnectableUserResponseDto exactly - deliberately narrow, never includes email/phone. */
export interface ConnectableUserResponseDto {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  connectionStatus?: ConnectionStatus;
}

export interface ConnectionRequestResponseDto {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: ConnectionRequestStatus;
  createdAt?: string;
}

export interface ConnectionResponseDto {
  connectionRequestId: string;
  userId: string;
  name: string;
  role: string;
  avatarUrl?: string;
  connectedSince?: string;
}

export interface SendConnectionRequestPayload {
  toUserId: string;
}

export interface RespondToConnectionRequestPayload {
  accept: boolean;
}
