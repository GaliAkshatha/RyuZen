import mongoose, { Schema, Document } from "mongoose";

export interface MessageDocument extends Document {

    chatId: mongoose.Types.ObjectId;

    senderId: mongoose.Types.ObjectId;

    message: string;

    attachments: string[];

    readBy: mongoose.Types.ObjectId[];

    createdAt: Date;

}

const MessageSchema = new Schema<MessageDocument>(

    {

        chatId: {

            type: Schema.Types.ObjectId,

            ref: "Chat",

            required: true,

            index: true,

        },

        senderId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        message: {

            type: String,

            required: true,

            trim: true,

        },

        attachments: [{

            type: String,

        }],

        readBy: [{

            type: Schema.Types.ObjectId,

            ref: "User",

        }],

    },

    {

        timestamps: {

            createdAt: true,

            updatedAt: false,

        },

        versionKey: false,

    }

);

export const MessageModel = mongoose.model<MessageDocument>(

    "Message",

    MessageSchema

);
