import { AIChat } from "../../domain/entities/AIChat.js";

import { AIChatResponseDto } from "../../application/dto/AIChatResponseDto.js";

export class AIChatResponseMapper {

    static toDto(

        chat: AIChat

    ): AIChatResponseDto {

        return {

            id:
                chat.id!,

            userId:
                chat.userId,

            messages:
                chat.messages.map(

                    message => ({

                        role:
                            message.role,

                        content:
                            message.content,

                        timestamp:
                            message.timestamp

                    })

                ),

            context:
                chat.context,

            createdAt:
                chat.createdAt

        };

    }

}
