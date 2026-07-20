import { Chat } from "../../domain/entities/Chat.js";

import { ChatType } from "../../domain/constants/ChatType.js";

import {
    ChatDocument
} from "../persistence/ChatModel.js";

export class ChatMapper {

    static toDomain(

        document: ChatDocument

    ): Chat {

        return Chat.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            participants:
                document.participants.map(

                    id => id.toString()

                ),

            type:
                document.type as ChatType,

            createdAt:
                document.createdAt

        });

    }

    static toPersistence(

        chat: Chat

    ) {

        const data =
            chat.toObject();

        return {

            organizationId:
                data.organizationId,

            participants:
                data.participants,

            type:
                data.type

        };

    }

}
