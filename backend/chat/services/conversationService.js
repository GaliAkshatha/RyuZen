import Conversation from "../models/Conversation.js";
import User from "../../models/User.js";


class ConversationService {

    async getUsers() {

        return await User.find({

            role: "user",

        }).select(

            "name email"

        );

    }

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

    async getUserConversations(userId) {

        const conversations =

            await Conversation.find({

                participants: userId,

            })

            .populate(

                "participants",

                "name email profilePicture role"

            )

            .populate({

                path: "lastMessage",

                populate: {

                    path: "sender",

                    select: "name"

                }

            })

            .sort({

                lastActivity: -1,

            });

        return conversations.map(

            (conversation) => {

                const otherParticipant =

                    conversation.participants.find(

                        (participant) =>

                            participant._id.toString() !== userId

                    );

                return {

                    _id: conversation._id,

                    participants: conversation.participants,

                    otherParticipant: conversation.isGroup
                        ? null
                        : otherParticipant,

                    lastMessage:

                        conversation.lastMessage,

                    lastActivity:

                        conversation.lastActivity,

                    unreadCount:

                        conversation.unreadCount || 0,

                    isGroup:

                        conversation.isGroup,

                    groupName:

                        conversation.groupName,

                };

            }

        );

    }


}

export default new ConversationService();