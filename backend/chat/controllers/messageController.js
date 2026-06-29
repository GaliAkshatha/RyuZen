import messageService from "../services/messageService.js";

export async function sendMessage(req, res) {

    try {

        const {

            conversationId,

            senderId,

            content,

            messageType,

        } = req.body;

        const message =
            await messageService.sendMessage({

                conversationId,

                senderId,

                content,

                messageType,

            });

        res.status(201).json({

            success: true,

            message: "Message sent successfully.",

            data: message,

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message,

        });

    }

}

export async function getMessages(req, res) {

    try {

        const messages =
            await messageService.getMessages(

                req.params.id

            );

        res.status(200).json({

            success: true,

            message: "Messages fetched successfully.",

            data: messages,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

}