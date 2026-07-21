import { useApiQuery } from "@/hooks/useApiQuery";

import { aiChatService } from "@/features/ai-chat/services/aiChat.service";

export function useAIChat(id: string | undefined) {
  return useApiQuery({
    queryKey: ["ai-chats", id] as const,
    queryFn: () => aiChatService.getById(id ?? ""),
    enabled: Boolean(id),
  });
}
