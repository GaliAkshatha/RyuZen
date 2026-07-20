import { Message } from "../../domain/entities/Message.js";

import { MessageResponseDto } from "../../application/dto/MessageResponseDto.js";

export class MessageResponseMapper {

    static toDto(

        message: Message,

        viewerUserId: string

    ): MessageResponseDto {

        return {

            id:
                message.id!,

            chatId:
                message.chatId,

            senderId:
                message.senderId,

            message:
                message.message,

            attachments:
                message.attachments,

            isRead:
                message.isReadBy(
                    viewerUserId
                ),

            createdAt:
                message.createdAt

        };

    }

}
