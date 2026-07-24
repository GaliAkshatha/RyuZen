import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Plus, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { ChatType } from "@/types/enums";

import { useMyChats } from "@/features/chat/hooks/useMyChats";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";
import { NewChatForm } from "@/features/chat/components/NewChatForm";

export function ChatListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: chats, isLoading, isError, error, refetch } = useMyChats();
  const { mutate: createChat, isPending, error: createError } = useCreateChat();
  const [showNewChatForm, setShowNewChatForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
          Chat
        </h1>
        <Button size="sm" onClick={() => setShowNewChatForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          New Chat
        </Button>
      </div>

      {showNewChatForm && (
        <Card>
          <CardHeader>
            <CardTitle>Start a Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <NewChatForm
              isSubmitting={isPending}
              error={createError}
              onSubmit={(participantId) =>
                createChat(
                  { participantIds: [participantId] },
                  {
                    onSuccess: (chat) => {
                      toast({ title: "Chat started" });
                      setShowNewChatForm(false);
                      navigate(`/app/chat/${chat.id}`);
                    },
                  },
                )
              }
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-16" />
          ))}
        </div>
      ) : !chats || chats.length === 0 ? (
        <EmptyState title="No conversations yet" description="Start a new chat to get going." />
      ) : (
        <ul className="flex flex-col gap-2">
          {chats.map((chat) => {
            const otherParticipants = chat.participants.filter((p) => p !== user?.id);
            return (
              <li key={chat.id}>
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/app/chat/${chat.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") navigate(`/app/chat/${chat.id}`);
                  }}
                >
                  <CardContent className="flex items-center justify-between gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span className="font-body text-sm text-foreground">
                        {chat.type === ChatType.DIRECT
                          ? (otherParticipants[0] ?? "Conversation")
                          : `Group (${chat.participants.length})`}
                      </span>
                    </div>
                    <Badge variant="outline">{chat.type}</Badge>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
