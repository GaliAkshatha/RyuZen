import { Message } from "../../domain/entities/Message.js";

import { IChatRepository } from "../../infrastructure/repositories/IChatRepository.js";

import { IMessageRepository } from "../../infrastructure/repositories/IMessageRepository.js";

import { MessageResponseMapper } from "../../infrastructure/mappers/MessageResponseMapper.js";

import { SendMessageDto } from "../dto/SendMessageDto.js";
import { MessageResponseDto } from "../dto/MessageResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class SendMessageUseCase {

    constructor(

        private readonly repository: IMessageRepository,

        private readonly chatRepository: IChatRepository

    ) {}

    async execute(

        chatId: string,

        organizationId: string,

        senderId: string,

        dto: SendMessageDto

    ): Promise<MessageResponseDto> {

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

        if (!chat.hasParticipant(senderId)) {

            throw new ApiError(

                "You are not a participant of this chat.",

                HttpStatus.FORBIDDEN

            );

        }

        const message = Message.create({

            chatId,

            senderId,

            message:
                dto.message,

            attachments:
                dto.attachments ?? [],

            readBy:
                [senderId]

        });

        const created =

            await this.repository.create(

                message

            );

        return MessageResponseMapper.toDto(

            created,

            senderId

        );

    }

}
