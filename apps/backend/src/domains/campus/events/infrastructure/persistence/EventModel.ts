import mongoose, { Schema, Document } from "mongoose";

export interface EventDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    clubId?: mongoose.Types.ObjectId;

    createdBy: mongoose.Types.ObjectId;

    title: string;

    description: string;

    venue?: string;

    startDate: Date;

    endDate: Date;

    registrationDeadline?: Date;

    capacity?: number;

    points: number;

    certificateEnabled: boolean;

    status: string;

    createdAt: Date;

    updatedAt: Date;

}

const EventSchema = new Schema<EventDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        clubId: {

            type: Schema.Types.ObjectId,

            ref: "Club",

        },

        createdBy: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        title: {

            type: String,

            required: true,

            trim: true,

        },

        description: {

            type: String,

            required: true,

        },

        venue: {

            type: String,

            trim: true,

        },

        startDate: {

            type: Date,

            required: true,

        },

        endDate: {

            type: Date,

            required: true,

        },

        registrationDeadline: {

            type: Date,

        },

        capacity: {

            type: Number,

        },

        points: {

            type: Number,

            default: 0,

        },

        certificateEnabled: {

            type: Boolean,

            default: false,

        },

        status: {

            type: String,

            enum: ["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"],

            default: "DRAFT",

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const EventModel = mongoose.model<EventDocument>(

    "Event",

    EventSchema

);
