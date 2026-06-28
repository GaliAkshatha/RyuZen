import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

class MessageService {

    async sendMessage({

        conversationId,

        senderId,

        content,

        messageType = "text",

    }){

        if (

            !conversationId ||

            !senderId ||

            !content?.trim()

        ) {

            throw new Error(
                "Invalid message."
            );

        }

        const conversation =
            await Conversation.findById(
                conversationId
            );

        if (!conversation) {

            throw new Error(
                "Conversation not found."
            );

        }

        const isParticipant =
            conversation.participants.some(

                participant =>

                    participant.toString() === senderId

            );

        if (!isParticipant) {

            throw new Error(
                "Unauthorized."
            );

        }

        const message =
            await Message.create({

                conversation: conversationId,

                sender: senderId,

                content,

                messageType,

            });

        conversation.lastMessage =
            message._id;

        conversation.lastActivity =
            new Date();

        await conversation.save();

        return await Message.findById(
            message._id
        )

        .populate(
            "sender",
            "name email profilePicture"
        );

    }

    async getMessages(
        conversationId
    ) {

        return await Message.find({

            conversation: conversationId,

        })

        .populate(

            "sender",

            "name email profilePicture"

        )

        .sort({

            createdAt: 1,

        });

    }

}