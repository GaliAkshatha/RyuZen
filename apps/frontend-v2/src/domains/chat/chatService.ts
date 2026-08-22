import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Chat, Message, CreateChatRequest, SendMessageRequest } from "@/domains/chat/chat.types";

/** Confirmed ORG_ADMIN/FACULTY/STUDENT/ALUMNI - a campus community feature, not for Placement Admin/Recruiter/Super Admin. */
export const chatService = {
  async list(): Promise<Chat[]> {
    const res = await apiClient.get<ApiSuccessResponse<Chat[]>>("/chats");
    return res.data.data;
  },
  async getById(id: string): Promise<Chat> {
    const res = await apiClient.get<ApiSuccessResponse<Chat>>(`/chats/${id}`);
    return res.data.data;
  },
  async create(payload: CreateChatRequest): Promise<Chat> {
    const res = await apiClient.post<ApiSuccessResponse<Chat>>("/chats", payload);
    return res.data.data;
  },
  async listMessages(chatId: string): Promise<Message[]> {
    const res = await apiClient.get<ApiSuccessResponse<Message[]>>(`/chats/${chatId}/messages`);
    return res.data.data;
  },
  async sendMessage(chatId: string, payload: SendMessageRequest): Promise<Message> {
    const res = await apiClient.post<ApiSuccessResponse<Message>>(`/chats/${chatId}/messages`, payload);
    return res.data.data;
  },
  async markRead(messageId: string): Promise<Message> {
    const res = await apiClient.patch<ApiSuccessResponse<Message>>(`/messages/${messageId}/read`);
    return res.data.data;
  },
};
