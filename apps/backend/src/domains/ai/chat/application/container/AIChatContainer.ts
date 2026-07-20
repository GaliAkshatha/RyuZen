import { AIChatRepository } from "../../infrastructure/repositories/AIChatRepository.js";

import { StubAIProvider } from "../../infrastructure/ai/StubAIProvider.js";

import { SendAIChatMessageUseCase } from "../use-cases/SendAIChatMessageUseCase.js";
import { GetMyAIChatsUseCase } from "../use-cases/GetMyAIChatsUseCase.js";
import { GetAIChatUseCase } from "../use-cases/GetAIChatUseCase.js";

const aiChatRepository = new AIChatRepository();

/*
 StubAIProvider is a placeholder (see infrastructure/ai/StubAIProvider.ts).
 Swap this single binding for a real IAIProvider implementation to
 go live; no other file in this module needs to change.
*/
const aiProvider = new StubAIProvider();

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
