import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { aiChatService } from "@/domains/ai-chat/aiChatService";
import type { AIProviderStatus } from "@/domains/ai-chat/aiChat.types";

/** Shown on the AI Assistant page's info banner - which real provider is configured, not a sensitive value (confirmed open to any authenticated role). */
export function useAIProviderStatus() {
  return useApiQuery<AIProviderStatus>({
    queryKey: ["ai", "provider"] as const,
    queryFn: aiChatService.getProviderStatus,
  });
}
