import mongoose, { Schema, Document } from "mongoose";

export interface InterviewRoundDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    applicationId: mongoose.Types.ObjectId;

    roundType: string;

    sequence: number;

    scheduledAt?: Date;

    interviewerId?: mongoose.Types.ObjectId;

    status: string;

    evaluation?: {
        rating?: number;
        strengths?: string;
        weaknesses?: string;
        notes?: string;
    };

    completedAt?: Date;

    createdAt: Date;

}

const InterviewRoundSchema = new Schema<InterviewRoundDocument>(

    {

        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        applicationId: {
            type: Schema.Types.ObjectId,
            ref: "JobApplication",
            required: true,
            index: true,
        },

        roundType: {
            type: String,
            required: true,
        },

        sequence: {
            type: Number,
            required: true,
        },

        scheduledAt: {
            type: Date,
        },

        interviewerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        status: {
            type: String,
            enum: ["SCHEDULED", "COMPLETED", "PASSED", "FAILED", "CANCELLED"],
            default: "SCHEDULED",
        },

        evaluation: {
            rating: { type: Number },
            strengths: { type: String },
            weaknesses: { type: String },
            notes: { type: String },
        },

        completedAt: {
            type: Date,
        },

    },

    {

        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,

    }

);

InterviewRoundSchema.index({ applicationId: 1, sequence: 1 });

export const InterviewRoundModel = mongoose.model<InterviewRoundDocument>(

    "InterviewRound",

    InterviewRoundSchema

);
