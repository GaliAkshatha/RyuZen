import { AIChat } from "../../domain/entities/AIChat.js";

import { AIChatRole } from "../../domain/constants/AIChatRole.js";

import { IAIChatRepository } from "../../infrastructure/repositories/IAIChatRepository.js";

import { AIChatResponseMapper } from "../../infrastructure/mappers/AIChatResponseMapper.js";

import { IAIProvider } from "../ports/IAIProvider.js";

import { SendAIChatMessageDto } from "../dto/SendAIChatMessageDto.js";
import { AIChatResponseDto } from "../dto/AIChatResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class SendAIChatMessageUseCase {

    constructor(

        private readonly repository: IAIChatRepository,

        private readonly aiProvider: IAIProvider

    ) {}

    async execute(

        userId: string,

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

        const reply =

            await this.aiProvider.generateReply(

                chat.messages,

                chat.context

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
