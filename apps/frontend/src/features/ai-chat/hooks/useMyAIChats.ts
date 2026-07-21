import { useApiQuery } from "@/hooks/useApiQuery";

import { aiChatService } from "@/features/ai-chat/services/aiChat.service";

export const MY_AI_CHATS_QUERY_KEY = ["ai-chats", "mine"] as const;

export function useMyAIChats() {
  return useApiQuery({
    queryKey: MY_AI_CHATS_QUERY_KEY,
    queryFn: aiChatService.listMine,
  });
}
