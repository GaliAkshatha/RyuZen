import Conversation from "../models/Conversation.js";

class ConversationService {

    async createConversation(
        senderId,
        receiverId
    ) {

        let conversation =
            await Conversation.findOne({

                participants: {

                    $all: [

                        senderId,

                        receiverId,

                    ],

                },

                isGroup: false,

            });

        if (conversation) {

            return conversation;

        }

        conversation =
            await Conversation.create({

                participants: [

                    senderId,

                    receiverId,

                ],

                isGroup: false,

            });

        return conversation;

    }

    async getConversation(
        conversationId
    ) {

        return await Conversation.findById(
            conversationId
        )

        .populate(

            "participants",

            "name email profilePicture"

        )

        .populate(

            "lastMessage"

        );

    }

    async getUserConversations(
        userId
    ) {

        return await Conversation.find({

            participants: userId,

        })

        .populate(

            "participants",

            "name email profilePicture"

        )

        .populate(

            "lastMessage"

        )

        .sort({

            lastActivity: -1,

        });

    }

}

export default new ConversationService();