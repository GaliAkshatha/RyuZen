import { useApiQuery } from "@/hooks/useApiQuery";

import { chatService } from "@/features/chat/services/chat.service";

export function useChatMessages(chatId: string) {
  return useApiQuery({
    queryKey: ["chats", chatId, "messages"] as const,
    queryFn: () => chatService.listMessages(chatId),
    enabled: Boolean(chatId),
  });
}
