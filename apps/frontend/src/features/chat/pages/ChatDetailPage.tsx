import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";

import { Card, CardContent } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { ChatType } from "@/types/enums";

import { useChat } from "@/features/chat/hooks/useChat";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";
import { useMarkMessageRead } from "@/features/chat/hooks/useMarkMessageRead";
import { MessageComposer } from "@/features/chat/components/MessageComposer";

export function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: chat, isLoading: isLoadingChat, isError, error, refetch } = useChat(id ?? "");
  const { data: messages, isLoading: isLoadingMessages } = useChatMessages(id ?? "");
  const { mutate: sendMessage, isPending, error: sendError } = useSendMessage(id ?? "");
  const { mutate: markRead } = useMarkMessageRead(id ?? "");

  const unreadFromOthers = (messages ?? []).filter((m) => !m.isRead && m.senderId !== user?.id);

  useEffect(() => {
    unreadFromOthers.forEach((message) => markRead(message.id));
    // Intentionally scoped to the message list changing, not markRead identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  if (isLoadingChat) {
    return <SkeletonCard className="max-w-2xl" />;
  }

  if (isError || !chat) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const otherParticipants = chat.participants.filter((p) => p !== user?.id);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Link
        to="/app/chat"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Chat
      </Link>

      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <h1 className="font-display text-xl font-semibold text-foreground">
          {chat.type === ChatType.DIRECT ? (otherParticipants[0] ?? "Conversation") : `Group Chat`}
        </h1>
      </div>

      <Card>
        <CardContent className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto p-4">
          {isLoadingMessages ? (
            <p className="font-body text-sm text-muted-foreground">Loading messages…</p>
          ) : !messages || messages.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No messages yet. Say hello!</p>
          ) : (
            messages.map((message) => {
              const isMine = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={cn("flex flex-col gap-0.5", isMine ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 font-body text-sm",
                      isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    {message.message}
                  </div>
                  {message.createdAt && (
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <MessageComposer
        isSubmitting={isPending}
        error={sendError}
        onSubmit={(values) =>
          sendMessage(values, {
            onError: () => toast({ title: "Failed to send message", variant: "destructive" }),
          })
        }
      />
    </div>
  );
}
