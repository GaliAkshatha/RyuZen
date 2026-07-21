import { AIChatRole } from "@/types/enums";

/**
 * Mirrors AIChatResponseDto exactly. Open to every authenticated role
 * with no restriction — even SUPER_ADMIN, a rare exception to this
 * app's recurring exclusion pattern. Ownership enforced server-side
 * (404 "AI chat session not found." for a non-owner, same obscuring
 * convention as human Chat's participant check).
 *
 * IMPORTANT: confirmed this milestone that the backend's AI provider
 * is `StubAIProvider` — a deterministic placeholder, not a real
 * language model ("No live language-model credentials exist in this
 * environment," per its own doc comment). Every reply is a canned
 * string acknowledging the user's message, not genuine AI output. The
 * UI reflects this honestly rather than implying real intelligence
 * (no fake "typing" animation, no streaming — it's a normal request/
 * response call that happens to return placeholder text).
 */
export interface AIChatResponseDto {
  id: string;
  userId: string;
  messages: AIChatMessageResponseDto[];
  context?: string;
  createdAt?: string;
}

/** Mirrors AIChatMessageResponseDto exactly */
export interface AIChatMessageResponseDto {
  role: AIChatRole;
  content: string;
  timestamp: string;
}

/**
 * Mirrors SendAIChatMessageDto. Omitting `chatId` starts a NEW
 * session; providing an existing one continues it. `context` is a
 * short optional topic tag (e.g. "resume", "interview") that the stub
 * provider echoes back in its placeholder reply.
 */
export interface SendAIChatMessagePayload {
  chatId?: string;
  message: string;
  context?: string;
}
