/** Matches the real backend AI Chat DTOs exactly. */
export const AIChatRole = { USER: "USER", ASSISTANT: "ASSISTANT" } as const;
export type AIChatRole = (typeof AIChatRole)[keyof typeof AIChatRole];

export interface AIChatMessage {
  role: AIChatRole;
  content: string;
  timestamp: string;
}

export interface AIChat {
  id: string;
  userId: string;
  messages: AIChatMessage[];
  context?: string;
  createdAt?: string;
}

export interface SendAIChatMessageRequest {
  chatId?: string;
  message: string;
  context?: string;
}

export interface AIProviderStatus {
  provider: "gemini" | "ollama";
  displayName: string;
  mode: "cloud" | "local";
}
