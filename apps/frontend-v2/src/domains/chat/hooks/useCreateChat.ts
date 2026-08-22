import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { chatService } from "@/domains/chat/chatService";
import { CHATS_QUERY_KEY } from "@/domains/chat/hooks/useChats";
import type { CreateChatRequest, Chat } from "@/domains/chat/chat.types";

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useApiMutation<Chat, CreateChatRequest>({
    mutationFn: (payload) => chatService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY }),
  });
}
