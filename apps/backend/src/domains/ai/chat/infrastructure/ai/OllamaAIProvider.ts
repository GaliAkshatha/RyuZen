import { IAIProvider } from "../../application/ports/IAIProvider.js";
import { IAIChatMessage } from "../../domain/interfaces/IAIChatMessage.js";
import { AIChatRole } from "../../domain/constants/AIChatRole.js";

import {
    OllamaClient,
    OllamaChatMessage
} from "../../../../../shared/infrastructure/ai/OllamaClient.js";

import { buildChatSystemPrompt } from "./chatPrompts.js";

/*
 Real Ollama-backed AI Chat, replacing StubAIProvider. Uses
 OllamaClient.generateChat (Ollama's native /api/chat endpoint) since
 this is a genuine multi-turn conversation, not a single structured
 request — the one AI feature in this codebase shaped that way.

 No caching here (unlike Resume Review) — a chat reply is inherently
 personalized to the exact conversation so far, so there's no
 meaningful "same input, skip recomputation" case the way there is for
 reviewing the same resume twice.
*/

export class OllamaAIProvider implements IAIProvider {
    async generateReply(
        messages: IAIChatMessage[],
        context?: string
    ): Promise<string> {
        const systemPrompt = buildChatSystemPrompt(context);

        const chatMessages: OllamaChatMessage[] = [
            { role: "system", content: systemPrompt },
            ...messages.map(
                (message): OllamaChatMessage => ({
                    role:
                        message.role === AIChatRole.USER
                            ? "user"
                            : "assistant",
                    content: message.content
                })
            )
        ];

        return OllamaClient.generateChat(chatMessages);
    }
}
