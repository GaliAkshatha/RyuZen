import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { aiChatService } from "@/domains/ai-chat/aiChatService";
import { AI_CHATS_QUERY_KEY } from "@/domains/ai-chat/hooks/useAIChats";
import type { SendAIChatMessageRequest, AIChat } from "@/domains/ai-chat/aiChat.types";

export function useSendAIChatMessage() {
  const queryClient = useQueryClient();
  return useApiMutation<AIChat, SendAIChatMessageRequest>({
    mutationFn: (payload) => aiChatService.send(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AI_CHATS_QUERY_KEY }),
  });
}
