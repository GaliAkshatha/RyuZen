import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { chatService } from "@/domains/chat/chatService";
import type { SendMessageRequest, Message } from "@/domains/chat/chat.types";

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Message, SendMessageRequest>({
    mutationFn: (payload) => chatService.sendMessage(chatId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats", chatId, "messages"] }),
  });
}
