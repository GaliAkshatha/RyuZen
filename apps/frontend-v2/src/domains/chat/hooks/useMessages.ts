import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { chatService } from "@/domains/chat/chatService";
import type { Message } from "@/domains/chat/chat.types";

export function useMessages(chatId: string) {
  return useApiQuery<Message[]>({
    queryKey: ["chats", chatId, "messages"] as const,
    queryFn: () => chatService.listMessages(chatId),
    enabled: Boolean(chatId),
  });
}
