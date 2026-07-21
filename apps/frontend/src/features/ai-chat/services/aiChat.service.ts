import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AIChatResponseDto,
  SendAIChatMessagePayload,
} from "@/features/ai-chat/types/aiChat.types";

export const aiChatService = {
  listMine(): Promise<AIChatResponseDto[]> {
    return apiClient
      .get<AIChatResponseDto[]>(API_ENDPOINTS.aiChat)
      .then((response) => response.data);
  },

  getById(id: string): Promise<AIChatResponseDto> {
    return apiClient
      .get<AIChatResponseDto>(`${API_ENDPOINTS.aiChat}/${id}`)
      .then((response) => response.data);
  },

  /** Omitting chatId in the payload starts a new session; including it continues an existing one. */
  sendMessage(payload: SendAIChatMessagePayload): Promise<AIChatResponseDto> {
    return apiClient
      .post<AIChatResponseDto>(API_ENDPOINTS.aiChat, payload)
      .then((response) => response.data);
  },
};
