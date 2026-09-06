import mongoose, { Schema, Document } from "mongoose";

export interface InterviewExchangeSubdocument {

    question: string;

    difficulty: string;

    answer?: string;

    qualityScore?: number;

    askedAt: Date;

    answeredAt?: Date;

}

export interface MockInterviewSessionDocument extends Document {

    userId: mongoose.Types.ObjectId;

    role: string;

    exchanges: InterviewExchangeSubdocument[];

    status: string;

    durationMinutes: number;

    feedback?: string;

    strengths?: string[];

    improvements?: string[];

    score?: number;

    createdAt: Date;

}

const InterviewExchangeSchema = new Schema<InterviewExchangeSubdocument>(

    {

        question: {

            type: String,

            required: true,

        },

        difficulty: {

            type: String,

            enum: ["EASY", "MEDIUM", "HARD"],

            required: true,

            default: "MEDIUM",

        },

        answer: {

            type: String,

        },

        qualityScore: {

            type: Number,

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

            enum: ["IN_PROGRESS", "COMPLETED", "ABANDONED"],

            default: "IN_PROGRESS",

        },

        durationMinutes: {

            type: Number,

            required: true,

            default: 20,

        },

        feedback: {

            type: String,

        },

        strengths: {

            type: [String],

            default: undefined,

        },

        improvements: {

            type: [String],

            default: undefined,

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
