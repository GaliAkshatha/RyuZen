import mongoose, { Schema, Document } from "mongoose";

export interface ChatDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    participants: mongoose.Types.ObjectId[];

    type: string;

    createdAt: Date;

}

const ChatSchema = new Schema<ChatDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        participants: [{

            type: Schema.Types.ObjectId,

            ref: "User",

        }],

        type: {

            type: String,

            enum: ["DIRECT", "GROUP"],

            default: "DIRECT",

        },

    },

    {

        timestamps: {

            createdAt: true,

            updatedAt: false,

        },

        versionKey: false,

    }

);

ChatSchema.index(

    {

        organizationId: 1,

        participants: 1,

    }

);

export const ChatModel = mongoose.model<ChatDocument>(

    "Chat",

    ChatSchema

);
