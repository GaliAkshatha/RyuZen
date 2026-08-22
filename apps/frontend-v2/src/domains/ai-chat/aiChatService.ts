import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { AIChat, SendAIChatMessageRequest, AIProviderStatus } from "@/domains/ai-chat/aiChat.types";

export const aiChatService = {
  async send(payload: SendAIChatMessageRequest): Promise<AIChat> {
    const res = await apiClient.post<ApiSuccessResponse<AIChat>>("/ai/chat", payload);
    return res.data.data;
  },
  async list(): Promise<AIChat[]> {
    const res = await apiClient.get<ApiSuccessResponse<AIChat[]>>("/ai/chat");
    return res.data.data;
  },
  async getById(id: string): Promise<AIChat> {
    const res = await apiClient.get<ApiSuccessResponse<AIChat>>(`/ai/chat/${id}`);
    return res.data.data;
  },
  async getProviderStatus(): Promise<AIProviderStatus> {
    const res = await apiClient.get<ApiSuccessResponse<AIProviderStatus>>("/ai/provider");
    return res.data.data;
  },
};
