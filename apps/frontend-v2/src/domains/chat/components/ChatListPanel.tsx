import { MessageCircle } from "lucide-react";

import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/Skeleton";
import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/domains/auth/AuthContext";
import { useChats } from "@/domains/chat/hooks/useChats";
import { useMyConnections } from "@/domains/connections/hooks/useMyConnections";

/**
 * Resolves the other participant's real name by cross-referencing
 * the already-real Connections data (chats happen between real
 * connections in this product) rather than inventing a new user
 * lookup endpoint the backend doesn't expose.
 */
export function ChatListPanel({ activeChatId, onSelect }: { activeChatId: string | null; onSelect: (id: string) => void }) {
  const { user } = useAuth();
  const { data: chats, isLoading } = useChats();
  const { data: connections } = useMyConnections();

  const nameByUserId = new Map((connections ?? []).map((c) => [c.userId, c.name]));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return <EmptyState icon={MessageCircle} title="No conversations yet" description="Message a connection to start one." className="m-3" />;
  }

  return (
    <div className="flex flex-col overflow-y-auto p-2">
      {chats.map((chat) => {
        const otherId = chat.participants.find((p) => p !== user?.id);
        const name = (otherId && nameByUserId.get(otherId)) ?? "Conversation";
        return (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors",
              activeChatId === chat.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent/60",
            )}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
