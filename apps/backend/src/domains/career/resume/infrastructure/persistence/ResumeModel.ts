import mongoose, { Schema, Document } from "mongoose";

export interface ResumeDocument extends Document {

    userId: mongoose.Types.ObjectId;

    selectedTemplate?: mongoose.Types.ObjectId;

    resumeUrl?: string;

    lastGeneratedAt?: Date;

    atsScore?: number;

    visibility: string;

    createdAt: Date;

    updatedAt: Date;

}

const ResumeSchema = new Schema<ResumeDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            unique: true,

        },

        selectedTemplate: {

            type: Schema.Types.ObjectId,

            ref: "ResumeTemplate",

        },

        resumeUrl: {

            type: String,

            trim: true,

        },

        lastGeneratedAt: {

            type: Date,

        },

        atsScore: {

            type: Number,

        },

        visibility: {

            type: String,

            enum: ["PUBLIC", "PRIVATE"],

            default: "PRIVATE",

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const ResumeModel = mongoose.model<ResumeDocument>(

    "Resume",

    ResumeSchema

);
