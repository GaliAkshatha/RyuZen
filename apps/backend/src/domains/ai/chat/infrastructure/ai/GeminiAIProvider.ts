import { IAIProvider } from "../../application/ports/IAIProvider.js";
import { IAIChatMessage } from "../../domain/interfaces/IAIChatMessage.js";
import { AIChatRole } from "../../domain/constants/AIChatRole.js";

import {
    GeminiClient,
    GeminiChatMessage
} from "../../../../../shared/infrastructure/ai/GeminiClient.js";

import { buildChatSystemPrompt } from "./chatPrompts.js";

/*
 Real Gemini-backed AI Chat - the cloud counterpart to
 OllamaAIProvider, sharing the exact same system prompt (chatPrompts.ts)
 so behavior doesn't change depending on which provider is configured.
*/

export class GeminiAIProvider implements IAIProvider {
    async generateReply(
        messages: IAIChatMessage[],
        context?: string
    ): Promise<string> {
        const systemPrompt = buildChatSystemPrompt(context);

        const chatMessages: GeminiChatMessage[] = messages.map(
            (message): GeminiChatMessage => ({
                role: message.role === AIChatRole.USER ? "user" : "assistant",
                content: message.content
            })
        );

        return GeminiClient.generateChat(chatMessages, systemPrompt);
    }
}
