import { IChatRepository } from "../../infrastructure/repositories/IChatRepository.js";

import { IMessageRepository } from "../../infrastructure/repositories/IMessageRepository.js";

import { MessageResponseMapper } from "../../infrastructure/mappers/MessageResponseMapper.js";

import { MessageResponseDto } from "../dto/MessageResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetChatMessagesUseCase {

    constructor(

        private readonly repository: IMessageRepository,

        private readonly chatRepository: IChatRepository

    ) {}

    async execute(

        chatId: string,

        organizationId: string,

        userId: string

    ): Promise<MessageResponseDto[]> {

        const chat =

            await this.chatRepository.findById(
                chatId
            );

        if (

            !chat ||
            chat.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Chat not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (!chat.hasParticipant(userId)) {

            throw new ApiError(

                "You are not a participant of this chat.",

                HttpStatus.FORBIDDEN

            );

        }

        const messages =

            await this.repository.findByChat(
                chatId
            );

        return messages.map(

            message =>

                MessageResponseMapper.toDto(

                    message,

                    userId

                )

        );

    }

}
