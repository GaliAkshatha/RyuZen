import mongoose, { Schema, Document } from "mongoose";

export interface AIChatMessageSubdocument {

    role: string;

    content: string;

    timestamp: Date;

}

export interface AIChatDocument extends Document {

    userId: mongoose.Types.ObjectId;

    messages: AIChatMessageSubdocument[];

    context?: string;

    createdAt: Date;

}

const AIChatMessageSchema = new Schema<AIChatMessageSubdocument>(

    {

        role: {

            type: String,

            enum: ["USER", "ASSISTANT"],

            required: true,

        },

        content: {

            type: String,

            required: true,

        },

        timestamp: {

            type: Date,

            required: true,

        },

    },

    {

        _id: false,

    }

);

const AIChatSchema = new Schema<AIChatDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },

        messages: [AIChatMessageSchema],

        context: {

            type: String,

            trim: true,

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

export const AIChatModel = mongoose.model<AIChatDocument>(

    "AIChat",

    AIChatSchema

);
