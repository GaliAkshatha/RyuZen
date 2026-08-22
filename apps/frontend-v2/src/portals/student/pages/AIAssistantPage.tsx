import { useState } from "react";
import { Send, Sparkles, Info } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAIChats } from "@/domains/ai-chat/hooks/useAIChats";
import { useSendAIChatMessage } from "@/domains/ai-chat/hooks/useSendAIChatMessage";
import { useAIProviderStatus } from "@/domains/ai-chat/hooks/useAIProviderStatus";
import { AIChatRole } from "@/domains/ai-chat/aiChat.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real Gemini-backed (or Ollama, per GetAiProviderStatusUseCase)
 * chat. If the configured provider's API key is genuinely missing,
 * the backend's own real error message is shown as-is on send - not
 * hidden or replaced with a generic "something went wrong", since the
 * real message ("Set GEMINI_API_KEY, or set AI_PROVIDER=ollama...")
 * is actually actionable for whoever is running this deployment.
 */
export function AIAssistantPage() {
  const { data: chats, isLoading: isLoadingChats } = useAIChats();
  const { data: providerStatus } = useAIProviderStatus();
  const { mutate: sendMessage, isPending } = useSendAIChatMessage();
  const [draft, setDraft] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const [sendError, setSendError] = useState<AppApiError | null>(null);

  const activeChat = chats?.find((c) => c.id === activeChatId) ?? chats?.[0];
  const messages = activeChat?.messages ?? [];

  function handleSend() {
    if (!draft.trim()) return;
    setSendError(null);
    sendMessage(
      { chatId: activeChat?.id, message: draft.trim() },
      {
        onSuccess: (chat) => { setActiveChatId(chat.id); setDraft(""); },
        onError: (err) => setSendError(err),
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            AI Assistant
          </h1>
          <p className="text-sm text-muted-foreground">Ask about your resume, skills, or career plan.</p>
        </div>
        {providerStatus && (
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" aria-hidden="true" />
            {providerStatus.displayName} · {providerStatus.mode}
          </span>
        )}
      </div>

      <div className="flex flex-col rounded-lg border border-border" style={{ height: "480px" }}>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingChats ? (
            <div className="flex flex-col gap-2"><Skeleton className="h-10 w-2/3" /></div>
          ) : messages.length === 0 ? (
            <EmptyState icon={Sparkles} title="Ask me anything" description="Try: “Review my resume” or “What skills should I learn?”" />
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div key={i} className={m.role === AIChatRole.USER ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === AIChatRole.USER
                        ? "max-w-[75%] rounded-lg rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                        : "max-w-[75%] rounded-lg rounded-tl-sm bg-muted px-3 py-2 text-sm text-foreground"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {sendError && (
          <div className="border-t border-destructive/30 bg-destructive/5 px-4 py-2 text-xs text-destructive">
            {sendError.message}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-border p-3">
          <Input
            placeholder="Ask the AI assistant…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" disabled={isPending || !draft.trim()} onClick={handleSend} aria-label="Send">
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
