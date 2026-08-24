import { AIChat } from "../../domain/entities/AIChat.js";

import { AIChatRole } from "../../domain/constants/AIChatRole.js";

import { IAIChatRepository } from "../../infrastructure/repositories/IAIChatRepository.js";

import { AIChatResponseMapper } from "../../infrastructure/mappers/AIChatResponseMapper.js";

import { IAIProvider } from "../ports/IAIProvider.js";

import { ChatGroundingContextBuilder } from "../services/ChatGroundingContextBuilder.js";

import { SendAIChatMessageDto } from "../dto/SendAIChatMessageDto.js";
import { AIChatResponseDto } from "../dto/AIChatResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real, structured grounding added this pass - see
 * ChatGroundingContextBuilder's own comment for the full reasoning
 * (deliberately not RAG/GraphRAG). Computed fresh on every message,
 * not cached on the chat itself, so an activity closing or a new
 * drive opening mid-conversation is reflected immediately - this data
 * is cheap to fetch (a few filtered queries, not heavy computation),
 * so there's no real cost to staying current rather than caching.
 */
export class SendAIChatMessageUseCase {

    constructor(

        private readonly repository: IAIChatRepository,

        private readonly aiProvider: IAIProvider,

        private readonly groundingContextBuilder: ChatGroundingContextBuilder

    ) {}

    async execute(

        userId: string,

        organizationId: string,

        role: string,

        dto: SendAIChatMessageDto

    ): Promise<AIChatResponseDto> {

        let chat: AIChat;

        if (dto.chatId) {

            const existing =

                await this.repository.findById(
                    dto.chatId
                );

            if (

                !existing ||
                existing.userId !== userId

            ) {

                throw new ApiError(

                    "AI chat session not found.",

                    HttpStatus.NOT_FOUND

                );

            }

            chat = existing;

        } else {

            chat = AIChat.create({

                userId,

                messages:
                    [],

                context:
                    dto.context

            });

        }

        chat.addMessage(

            AIChatRole.USER,

            dto.message

        );

        const groundingContext = await this.groundingContextBuilder.build(

            userId,

            organizationId,

            role

        );

        const combinedContext = [chat.context, groundingContext]
            .filter((part): part is string => Boolean(part))
            .join(" ");

        const reply =

            await this.aiProvider.generateReply(

                chat.messages,

                combinedContext || undefined

            );

        chat.addMessage(

            AIChatRole.ASSISTANT,

            reply

        );

        const saved =

            dto.chatId

                ? await this.repository.save(chat)

                : await this.repository.create(chat);

        return AIChatResponseMapper.toDto(

            saved

        );

    }

}
