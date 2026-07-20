import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    senderId: mongoose.Types.ObjectId;

    title: string;

    message: string;

    type?: string;

    targetAudience: string;

    readBy: mongoose.Types.ObjectId[];

    createdAt: Date;

}

const NotificationSchema = new Schema<NotificationDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        senderId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        title: {

            type: String,

            required: true,

            trim: true,

        },

        message: {

            type: String,

            required: true,

            trim: true,

        },

        type: {

            type: String,

            enum: ["ANNOUNCEMENT", "ALERT", "INFO", "REMINDER"],

        },

        targetAudience: {

            type: String,

            enum: ["ALL", "ORG_ADMIN", "FACULTY", "STUDENT", "ALUMNI"],

            default: "ALL",

        },

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

export const NotificationModel = mongoose.model<NotificationDocument>(

    "Notification",

    NotificationSchema

);
