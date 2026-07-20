import { Message } from "../../domain/entities/Message.js";

import {
    MessageDocument
} from "../persistence/MessageModel.js";

export class MessageMapper {

    static toDomain(

        document: MessageDocument

    ): Message {

        return Message.create({

            id:
                document.id,

            chatId:
                document.chatId.toString(),

            senderId:
                document.senderId.toString(),

            message:
                document.message,

            attachments:
                [...(document.attachments ?? [])],

            readBy:
                document.readBy.map(

                    id => id.toString()

                ),

            createdAt:
                document.createdAt

        });

    }

    static toPersistence(

        message: Message

    ) {

        const data =
            message.toObject();

        return {

            chatId:
                data.chatId,

            senderId:
                data.senderId,

            message:
                data.message,

            attachments:
                data.attachments,

            readBy:
                data.readBy

        };

    }

}
