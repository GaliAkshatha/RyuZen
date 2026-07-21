import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { chatService } from "@/features/chat/services/chat.service";
import { MY_CHATS_QUERY_KEY } from "@/features/chat/hooks/useMyChats";
import type { ChatResponseDto, CreateChatPayload } from "@/features/chat/types/chat.types";

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useApiMutation<ChatResponseDto, CreateChatPayload>({
    mutationFn: chatService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_CHATS_QUERY_KEY });
    },
  });
}
