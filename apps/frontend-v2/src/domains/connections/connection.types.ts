/** Matches the real backend connection DTOs exactly - confirmed directly. */
export const ConnectionRequestStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;
export type ConnectionRequestStatus = (typeof ConnectionRequestStatus)[keyof typeof ConnectionRequestStatus];

/** Deliberately narrow (real backend comment confirms this) - never includes email/phone. connectionStatus lets the UI show the right button state instead of always "Connect". */
export interface ConnectableUser {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  connectionStatus?: "PENDING_SENT" | "PENDING_RECEIVED" | "ACCEPTED";
}

export interface Connection {
  connectionRequestId: string;
  userId: string;
  name: string;
  role: string;
  avatarUrl?: string;
  connectedSince?: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: ConnectionRequestStatus;
  createdAt?: string;
}

export interface SendConnectionRequestPayload {
  toUserId: string;
}

export interface RespondToConnectionRequestPayload {
  accept: boolean;
}
