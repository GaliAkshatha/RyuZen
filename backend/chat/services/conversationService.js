import Conversation from "../models/Conversation.js";

class ConversationService {

    async createConversation(

        senderId,

        receiverId

    ) {

        if (!senderId || !receiverId) {

            throw new Error(
                "Both users are required."
            );

        }

        if (senderId === receiverId) {

            throw new Error(
                "Cannot create conversation with yourself."
            );

        }

        let conversation =
            await Conversation.findOne({

                participants: {

                    $all: [

                        senderId,

                        receiverId,

                    ],

                },

                isGroup: false,

            })

            .populate(
                "participants",
                "name email profilePicture"
            );

        if (conversation) {

            return conversation;

        }

        conversation =
            await Conversation.create({

                participants: [

                    senderId,

                    receiverId,

                ],

            });

        return await Conversation.findById(
            conversation._id
        )

        .populate(
            "participants",
            "name email profilePicture"
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