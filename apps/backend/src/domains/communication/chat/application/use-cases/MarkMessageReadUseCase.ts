import { IChatRepository } from "../../infrastructure/repositories/IChatRepository.js";

import { IMessageRepository } from "../../infrastructure/repositories/IMessageRepository.js";

import { MessageResponseMapper } from "../../infrastructure/mappers/MessageResponseMapper.js";

import { MessageResponseDto } from "../dto/MessageResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class MarkMessageReadUseCase {

    constructor(

        private readonly repository: IMessageRepository,

        private readonly chatRepository: IChatRepository

    ) {}

    async execute(

        messageId: string,

        organizationId: string,

        userId: string

    ): Promise<MessageResponseDto> {

        const message =

            await this.repository.findById(
                messageId
            );

        if (!message) {

            throw new ApiError(

                "Message not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const chat =

            await this.chatRepository.findById(
                message.chatId
            );

        if (

            !chat ||
            chat.organizationId !== organizationId ||
            !chat.hasParticipant(userId)

        ) {

            throw new ApiError(

                "Message not found.",

                HttpStatus.NOT_FOUND

            );

        }

        message.markReadBy(

            userId

        );

        const updated =

            await this.repository.save(
                message
            );

        return MessageResponseMapper.toDto(

            updated,

            userId

        );

    }

}
