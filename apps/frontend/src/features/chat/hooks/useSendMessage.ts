import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { chatService } from "@/features/chat/services/chat.service";
import type { MessageResponseDto, SendMessagePayload } from "@/features/chat/types/chat.types";

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<MessageResponseDto, SendMessagePayload>({
    mutationFn: (payload) => chatService.sendMessage(chatId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", chatId, "messages"] });
    },
  });
}
