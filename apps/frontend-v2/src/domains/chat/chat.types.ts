/** Matches the real backend Chat/Message DTOs exactly. */
export const ChatType = { DIRECT: "DIRECT", GROUP: "GROUP" } as const;
export type ChatType = (typeof ChatType)[keyof typeof ChatType];

export interface Chat {
  id: string;
  organizationId: string;
  participants: string[];
  type: ChatType;
  createdAt?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  attachments: string[];
  isRead: boolean;
  createdAt?: string;
}

export interface CreateChatRequest {
  participantIds: string[];
  type?: ChatType;
}

export interface SendMessageRequest {
  message: string;
  attachments?: string[];
}
