import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { chatService } from "@/features/chat/services/chat.service";
import type { MessageResponseDto } from "@/features/chat/types/chat.types";

export function useMarkMessageRead(chatId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<MessageResponseDto, string>({
    mutationFn: (messageId) => chatService.markMessageRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", chatId, "messages"] });
    },
  });
}
