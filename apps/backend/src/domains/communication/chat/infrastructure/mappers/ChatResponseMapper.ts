import { Chat } from "../../domain/entities/Chat.js";

import { ChatResponseDto } from "../../application/dto/ChatResponseDto.js";

export class ChatResponseMapper {

    static toDto(

        chat: Chat

    ): ChatResponseDto {

        return {

            id:
                chat.id!,

            organizationId:
                chat.organizationId,

            participants:
                chat.participants,

            type:
                chat.type,

            createdAt:
                chat.createdAt

        };

    }

}
