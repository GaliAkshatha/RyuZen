import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(

    {

        conversation: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Conversation",

            required: true,

        },

        sender: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        content: {

            type: String,

            required: true,

            trim: true,

        },

        messageType: {

            type: String,

            enum: [
                "text",
                "image",
                "pdf",
                "activity",
                "assignment",
                "ai",
            ],

            default: "text",
        },

        attachment: {

            type: String,

            default: null,

        },

        replyTo: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Message",

            default: null,
        },

        readBy: {

            type:  mongoose.Schema.Types.ObjectId,

            ref: "User",

        },
        
        isEdited: {

            type: Boolean,

            default: false,
        },
        
    },

    {

        timestamps: true,

    }

);

export default mongoose.model(
    "Message",
    messageSchema
);