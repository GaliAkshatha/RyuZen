import mongoose, { Schema, Document } from "mongoose";

export interface InterviewExchangeSubdocument {

    question: string;

    answer?: string;

    askedAt: Date;

    answeredAt?: Date;

}

export interface MockInterviewSessionDocument extends Document {

    userId: mongoose.Types.ObjectId;

    role: string;

    exchanges: InterviewExchangeSubdocument[];

    status: string;

    feedback?: string;

    score?: number;

    createdAt: Date;

}

const InterviewExchangeSchema = new Schema<InterviewExchangeSubdocument>(

    {

        question: {

            type: String,

            required: true,

        },

        answer: {

            type: String,

        },

        askedAt: {

            type: Date,

            required: true,

        },

        answeredAt: {

            type: Date,

        },

    },

    {

        _id: false,

    }

);

const MockInterviewSessionSchema = new Schema<MockInterviewSessionDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },

        role: {

            type: String,

            required: true,

            trim: true,

        },

        exchanges: [InterviewExchangeSchema],

        status: {

            type: String,

            enum: ["IN_PROGRESS", "COMPLETED"],

            default: "IN_PROGRESS",

        },

        feedback: {

            type: String,

        },

        score: {

            type: Number,

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

export const MockInterviewSessionModel = mongoose.model<MockInterviewSessionDocument>(

    "MockInterviewSession",

    MockInterviewSessionSchema

);
