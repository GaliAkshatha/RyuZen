import conversationService
from "../services/conversationService.js";

export async function getUsers(req, res) {

    try {

        const users =
            await conversationService.getUsers();

        res.status(200).json({

            success: true,

            message: "Users fetched successfully.",

            data: users,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

}

export async function createConversation(

    req,

    res

) {

    try {

        const {

            senderId,

            receiverId,

        } = req.body;

        const conversation =
            await conversationService
            .createConversation(

                senderId,

                receiverId

            );

        res.status(201).json({

            success: true,

            message:
                "Conversation ready.",

            data:
                conversation,

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:
                error.message,

        });

    }

}

export async function getUserConversations(req, res) {

    try {

        const conversations =
            await conversationService.getUserConversations(
                req.params.userId
            );

        res.status(200).json({

            success: true,

            message: "Conversations fetched successfully.",

            data: conversations,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

}