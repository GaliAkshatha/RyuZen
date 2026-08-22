import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { aiChatService } from "@/domains/ai-chat/aiChatService";
import type { AIChat } from "@/domains/ai-chat/aiChat.types";

export const AI_CHATS_QUERY_KEY = ["ai-chat"] as const;

export function useAIChats() {
  return useApiQuery<AIChat[]>({ queryKey: AI_CHATS_QUERY_KEY, queryFn: aiChatService.list });
}
