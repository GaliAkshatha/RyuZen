import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    senderId: mongoose.Types.ObjectId;

    title: string;

    message: string;

    type?: string;

    targetAudience: string;

    /** Only set for system-generated, single-recipient notifications (targetAudience: TARGETED). */
    recipientUserId?: mongoose.Types.ObjectId;

    departmentIds?: mongoose.Types.ObjectId[];

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

            enum: ["ALL", "ORG_ADMIN", "FACULTY", "STUDENT", "ALUMNI", "TARGETED"],

            default: "ALL",

        },

        recipientUserId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            index: true,

        },

        departmentIds: [{

            type: Schema.Types.ObjectId,

            ref: "Department",

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

export const NotificationModel = mongoose.model<NotificationDocument>(

    "Notification",

    NotificationSchema

);
