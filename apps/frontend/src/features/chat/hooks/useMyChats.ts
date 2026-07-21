import { useApiQuery } from "@/hooks/useApiQuery";

import { chatService } from "@/features/chat/services/chat.service";

export const MY_CHATS_QUERY_KEY = ["chats", "mine"] as const;

export function useMyChats() {
  return useApiQuery({
    queryKey: MY_CHATS_QUERY_KEY,
    queryFn: chatService.listMine,
  });
}
