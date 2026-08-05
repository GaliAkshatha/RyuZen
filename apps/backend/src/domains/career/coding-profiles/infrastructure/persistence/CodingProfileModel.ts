import mongoose, { Schema, Document } from "mongoose";

export interface CodingProfileDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    platform: string;

    handle: string;

    verified: boolean;

    currentRating?: number;

    maxRating?: number;

    rank?: string;

    problemsSolved?: number;

    lastSyncedAt?: Date;

    createdAt: Date;

    updatedAt: Date;

}

const CodingProfileSchema = new Schema<CodingProfileDocument>(

    {

        organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },

        studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },

        platform: {
            type: String,
            enum: ["CODEFORCES", "LEETCODE", "HACKERRANK"],
            required: true,
        },

        handle: { type: String, required: true, trim: true },

        verified: { type: Boolean, default: false },

        currentRating: { type: Number },

        maxRating: { type: Number },

        rank: { type: String },

        problemsSolved: { type: Number },

        lastSyncedAt: { type: Date },

    },

    { timestamps: true, versionKey: false }

);

// One real profile per student per platform - a student can't link two different Codeforces handles.
CodingProfileSchema.index({ studentId: 1, platform: 1 }, { unique: true });

export const CodingProfileModel = mongoose.model<CodingProfileDocument>(
    "CodingProfile",
    CodingProfileSchema
);
