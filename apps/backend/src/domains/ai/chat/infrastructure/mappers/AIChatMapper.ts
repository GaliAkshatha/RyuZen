import { AIChat } from "../../domain/entities/AIChat.js";

import { AIChatRole } from "../../domain/constants/AIChatRole.js";

import {
    AIChatDocument
} from "../persistence/AIChatModel.js";

export class AIChatMapper {

    static toDomain(

        document: AIChatDocument

    ): AIChat {

        return AIChat.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            messages:
                document.messages.map(

                    message => ({

                        role:
                            message.role as AIChatRole,

                        content:
                            message.content,

                        timestamp:
                            message.timestamp

                    })

                ),

            context:
                document.context,

            createdAt:
                document.createdAt

        });

    }

    static toPersistence(

        chat: AIChat

    ) {

        const data =
            chat.toObject();

        return {

            userId:
                data.userId,

            messages:
                data.messages,

            context:
                data.context

        };

    }

}
