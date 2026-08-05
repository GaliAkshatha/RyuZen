import { useEffect, useRef, useState } from "react";
import { Bot, Info, Plus } from "lucide-react";

import { Card, CardContent } from "@/shared/components/Card";
import { Spinner } from "@/shared/components/Spinner";
import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { cn } from "@/utils/cn";
import { AIChatRole } from "@/types/enums";

import { useMyAIChats } from "@/features/ai-chat/hooks/useMyAIChats";
import { useAIChat } from "@/features/ai-chat/hooks/useAIChat";
import { useSendAIChatMessage } from "@/features/ai-chat/hooks/useSendAIChatMessage";
import { AIChatComposer } from "@/features/ai-chat/components/AIChatComposer";

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AIChatPage() {
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const [pendingOutgoing, setPendingOutgoing] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: sessions } = useMyAIChats();
  const { data: activeChat, isLoading: isLoadingChat } = useAIChat(activeChatId);
  const { mutate: sendMessage, isPending, error } = useSendAIChatMessage();

  const messages = activeChat?.messages ?? [];

  // Real auto-scroll - without this, a person sending several messages
  // in a row has to manually scroll down every time to see the reply.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, pendingOutgoing]);

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col gap-4">
      <PageAtmosphere variant="arcane-grid" />
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Bot className="h-6 w-6 text-primary" aria-hidden="true" />
          AI Assistant
        </h1>
        <div className="flex items-center gap-2">
          {sessions && sessions.length > 0 && (
            <Select
              value={activeChatId ?? "__new__"}
              onValueChange={(value) => setActiveChatId(value === "__new__" ? undefined : value)}
            >
              <SelectTrigger className="w-48" aria-label="Select conversation">
                <SelectValue placeholder="Select a conversation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__new__">New conversation</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.context || `Chat ${session.id.slice(0, 6)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={() => setActiveChatId(undefined)}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 font-body text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          This assistant is powered by a locally-hosted AI model running on your own
          infrastructure — no data leaves your organization's servers.
        </span>
      </div>

      <Card>
        <CardContent
          ref={scrollRef}
          className="flex h-[28rem] flex-col gap-3 overflow-y-auto p-4"
        >
          {isLoadingChat ? (
            <div className="flex items-center justify-center py-6">
              <Spinner size="sm" />
            </div>
          ) : messages.length === 0 && !pendingOutgoing ? (
            <p className="font-body text-sm text-muted-foreground">
              Ask a question to start a new conversation.
            </p>
          ) : (
            <>
              {messages.map((message, index) => {
                const isUser = message.role === AIChatRole.USER;
                return (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={cn("flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}
                  >
                    {!isUser && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                        <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    )}
                    <div
                      className={cn(
                        "flex max-w-[85%] flex-col gap-0.5",
                        isUser ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 font-body text-sm",
                          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                        )}
                      >
                        {message.content}
                      </div>
                      <span className="px-1 font-body text-[10px] text-muted-foreground/70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Real optimistic feedback - the outgoing message and a
                "thinking" indicator both appear immediately on send,
                rather than the chat looking unresponsive until the
                full round-trip completes. */}
              {pendingOutgoing && (
                <div className="flex flex-row-reverse items-end gap-2">
                  <div className="max-w-[85%] rounded-lg bg-primary/60 px-3 py-2 font-body text-sm text-primary-foreground">
                    {pendingOutgoing}
                  </div>
                </div>
              )}
              {isPending && (
                <div className="flex items-end gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                    <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div className="flex items-center gap-1 rounded-lg bg-muted px-3 py-2">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AIChatComposer
        isSubmitting={isPending}
        error={error}
        showContextField={!activeChatId}
        onSubmit={(values) => {
          setPendingOutgoing(values.message);
          sendMessage(
            { chatId: activeChatId, message: values.message, context: values.context },
            {
              onSuccess: (chat) => {
                setActiveChatId(chat.id);
                setPendingOutgoing(null);
              },
              onError: () => setPendingOutgoing(null),
            },
          );
        }}
      />
    </div>
  );
}
