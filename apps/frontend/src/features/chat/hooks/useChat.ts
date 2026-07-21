import { useApiQuery } from "@/hooks/useApiQuery";

import { chatService } from "@/features/chat/services/chat.service";

export function useChat(id: string) {
  return useApiQuery({
    queryKey: ["chats", id] as const,
    queryFn: () => chatService.getById(id),
    enabled: Boolean(id),
  });
}
