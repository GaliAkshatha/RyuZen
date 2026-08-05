import { resolveAiProvider } from "../../../../../shared/infrastructure/ai/AIProviderFactory.js";

import { AiProviderStatusResponseDto } from "../dto/AiProviderStatusResponseDto.js";

/**
 * Purely reads which provider AI_PROVIDER currently selects - the
 * exact same resolveAiProvider() every DI container calls, so this
 * endpoint can never drift from what's actually powering the AI
 * features. The frontend consumes this instead of inferring the
 * provider from anything else.
 */
export class GetAiProviderStatusUseCase {

    execute(): AiProviderStatusResponseDto {

        const provider = resolveAiProvider();

        return provider === "ollama"
            ? { provider: "ollama", displayName: "Ollama Local", mode: "local" }
            : { provider: "gemini", displayName: "Gemini Cloud", mode: "cloud" };

    }

}
