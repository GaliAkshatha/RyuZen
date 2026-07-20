import { IAIProvider } from "../../application/ports/IAIProvider.js";

import { IAIChatMessage } from "../../domain/interfaces/IAIChatMessage.js";

import { AIChatRole } from "../../domain/constants/AIChatRole.js";

/*
 Placeholder AI provider.

 No live language-model credentials exist in this environment.
 This adapter returns a deterministic, clearly-labelled placeholder
 reply so the rest of the AI Chat pipeline (persistence, ownership
 checks, conversation history) is fully functional and testable.

 To go live: implement IAIProvider against a real provider (for
 example the Anthropic or OpenAI SDK, reading an API key from
 env.ts) and swap the binding in AIChatContainer.ts. No other file
 needs to change, since every use case depends only on the
 IAIProvider port.
*/
export class StubAIProvider
implements IAIProvider {

    async generateReply(

        messages: IAIChatMessage[],

        context?: string

    ): Promise<string> {

        const lastUserMessage =

            [...messages]

                .reverse()

                .find(

                    message => message.role === AIChatRole.USER

                );

        const topic =

            context

                ? ` about "${context}"`

                : "";

        return (

            `This is a placeholder AI response${topic}. ` +

            "No live language-model provider is configured yet. " +

            (

                lastUserMessage

                    ? `You said: "${lastUserMessage.content}".`

                    : ""

            )

        ).trim();

    }

}
