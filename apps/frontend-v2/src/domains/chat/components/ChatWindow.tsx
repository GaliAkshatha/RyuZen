import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuth } from "@/domains/auth/AuthContext";
import { useMessages } from "@/domains/chat/hooks/useMessages";
import { useSendMessage } from "@/domains/chat/hooks/useSendMessage";
import { MessageCircle } from "lucide-react";

export function ChatWindow({ chatId }: { chatId: string }) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useMessages(chatId);
  const { mutate: sendMessage, isPending } = useSendMessage(chatId);
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) return;
    sendMessage({ message: draft.trim() }, { onSuccess: () => setDraft("") });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-2/3" />
            ))}
          </div>
        ) : !messages || messages.length === 0 ? (
          <EmptyState icon={MessageCircle} title="No messages yet" description="Say hello to start the conversation." />
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m) => {
              const isMine = m.senderId === user?.id;
              return (
                <div key={m.id} className={isMine ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      isMine
                        ? "max-w-[70%] rounded-lg rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                        : "max-w-[70%] rounded-lg rounded-tl-sm bg-muted px-3 py-2 text-sm text-foreground"
                    }
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <Input
          placeholder="Type a message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button size="icon" disabled={isPending || !draft.trim()} onClick={handleSend} aria-label="Send">
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
