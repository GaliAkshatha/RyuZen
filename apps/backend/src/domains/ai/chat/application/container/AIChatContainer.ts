import { AIChatRepository } from "../../infrastructure/repositories/AIChatRepository.js";

import { createAiChatProvider } from "../../../../../shared/infrastructure/ai/AIProviderFactory.js";

import { SendAIChatMessageUseCase } from "../use-cases/SendAIChatMessageUseCase.js";
import { GetMyAIChatsUseCase } from "../use-cases/GetMyAIChatsUseCase.js";
import { GetAIChatUseCase } from "../use-cases/GetAIChatUseCase.js";

const aiChatRepository = new AIChatRepository();

/*
 Real AI Chat, backed by whichever provider AI_PROVIDER selects (see
 shared/infrastructure/ai/AIProviderFactory.ts — Gemini by default,
 Ollama when configured). Every use case below depends only on the
 IAIProvider port, so this is the only line that ever needed to
 change to go live, and the only line that ever needs to change to
 add a future provider.
*/
const aiProvider = createAiChatProvider();

export const aiChatContainer = {

    sendAIChatMessage:

        new SendAIChatMessageUseCase(

            aiChatRepository,

            aiProvider

        ),

    getMyAIChats:

        new GetMyAIChatsUseCase(
            aiChatRepository
        ),

    getAIChat:

        new GetAIChatUseCase(
            aiChatRepository
        )

};
