import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { chatService } from "@/domains/chat/chatService";
import type { Chat } from "@/domains/chat/chat.types";

export const CHATS_QUERY_KEY = ["chats"] as const;

export function useChats() {
  return useApiQuery<Chat[]>({ queryKey: CHATS_QUERY_KEY, queryFn: chatService.list });
}
