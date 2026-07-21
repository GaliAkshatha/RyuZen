import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  ChatResponseDto,
  CreateChatPayload,
  MessageResponseDto,
  SendMessagePayload,
} from "@/features/chat/types/chat.types";

export const chatService = {
  listMine(): Promise<ChatResponseDto[]> {
    return apiClient.get<ChatResponseDto[]>(API_ENDPOINTS.chats).then((response) => response.data);
  },

  getById(id: string): Promise<ChatResponseDto> {
    return apiClient
      .get<ChatResponseDto>(`${API_ENDPOINTS.chats}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreateChatPayload): Promise<ChatResponseDto> {
    return apiClient
      .post<ChatResponseDto>(API_ENDPOINTS.chats, payload)
      .then((response) => response.data);
  },

  listMessages(chatId: string): Promise<MessageResponseDto[]> {
    return apiClient
      .get<MessageResponseDto[]>(`${API_ENDPOINTS.chats}/${chatId}/messages`)
      .then((response) => response.data);
  },

  sendMessage(chatId: string, payload: SendMessagePayload): Promise<MessageResponseDto> {
    return apiClient
      .post<MessageResponseDto>(`${API_ENDPOINTS.chats}/${chatId}/messages`, payload)
      .then((response) => response.data);
  },

  /** Mounted at the separate /messages base path, not nested under /chats — confirmed via app.ts. */
  markMessageRead(messageId: string): Promise<MessageResponseDto> {
    return apiClient
      .patch<MessageResponseDto>(`${API_ENDPOINTS.messages}/${messageId}/read`, {})
      .then((response) => response.data);
  },
};
