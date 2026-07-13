import mongoose, { Schema, Document } from "mongoose";

export interface EventRegistrationDocument extends Document {

    eventId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    attendance: boolean;

    feedback?: string;

    certificateIssued: boolean;

    registeredAt: Date;

}

const EventRegistrationSchema = new Schema<EventRegistrationDocument>(

    {

        eventId: {

            type: Schema.Types.ObjectId,

            ref: "Event",

            required: true,

            index: true,

        },

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

            index: true,

        },

        attendance: {

            type: Boolean,

            default: false,

        },

        feedback: {

            type: String,

            trim: true,

        },

        certificateIssued: {

            type: Boolean,

            default: false,

        },

        registeredAt: {

            type: Date,

            required: true,

        },

    },

    {

        versionKey: false,

    }

);

EventRegistrationSchema.index(

    {

        eventId: 1,

        studentId: 1,

    },

    {

        unique: true,

    }

);

export const EventRegistrationModel = mongoose.model<EventRegistrationDocument>(

    "EventRegistration",

    EventRegistrationSchema

);
