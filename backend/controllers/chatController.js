import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getUsers = async (req, res) => {

    try {

        const users = await User.find({

            role: "user",

        }).select(
            "name email"
        );

        res.json({
            users,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

export const createConversation =
async (req, res) => {

    try {

        const {

            senderId,
            receiverId,

        } = req.body;

        let conversation =
            await Conversation.findOne({

                participants: {
                    $all: [
                        senderId,
                        receiverId,
                    ],
                },

            });

        if (!conversation) {

            conversation =
                await Conversation.create({

                    participants: [

                        senderId,

                        receiverId,

                    ],

                });

        }

        res.json({

            conversation,

        });

    } catch (error) {

        res.status(500).json({

            message:
                error.message,

        });

    }

};

export const sendMessage =
async (req, res) => {

    try {

        const {

            conversationId,

            sender,

            text,

        } = req.body;

        if (!text.trim()) {

            return res.status(400).json({

                message:
                    "Message cannot be empty.",

            });

        }

        const message =
            await Message.create({

                conversation:
                    conversationId,

                sender,

                text,

            });

        res.status(201).json({

            message,

        });

    } catch (error) {

        res.status(500).json({

            message:
                error.message,

        });

    }

};

export const getMessages =
async (req, res) => {

    try {

        const messages =
            await Message.find({

                conversation:
                    req.params.id,

            })

            .populate(
                "sender",
                "name"
            )

            .sort({

                createdAt: 1,

            });

        res.json({

            messages,

        });

    } catch (error) {

        res.status(500).json({

            message:
                error.message,

        });

    }

};

