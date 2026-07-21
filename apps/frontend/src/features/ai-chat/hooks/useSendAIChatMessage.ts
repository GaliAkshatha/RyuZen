import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { aiChatService } from "@/features/ai-chat/services/aiChat.service";
import { MY_AI_CHATS_QUERY_KEY } from "@/features/ai-chat/hooks/useMyAIChats";
import type {
  AIChatResponseDto,
  SendAIChatMessagePayload,
} from "@/features/ai-chat/types/aiChat.types";

export function useSendAIChatMessage() {
  const queryClient = useQueryClient();

  return useApiMutation<AIChatResponseDto, SendAIChatMessagePayload>({
    mutationFn: aiChatService.sendMessage,
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: MY_AI_CHATS_QUERY_KEY });
      queryClient.setQueryData(["ai-chats", chat.id], chat);
    },
  });
}
