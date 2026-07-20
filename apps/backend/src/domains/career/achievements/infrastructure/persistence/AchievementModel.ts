import mongoose, { Schema, Document } from "mongoose";

export interface AchievementDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    facultyId?: mongoose.Types.ObjectId;

    title: string;

    description?: string;

    category?: string;

    level?: string;

    position?: string;

    certificateUrl?: string;

    proofUrl?: string;

    achievementDate: Date;

    verifiedBy?: mongoose.Types.ObjectId;

    status: string;

    createdAt: Date;

    updatedAt: Date;

}

const AchievementSchema = new Schema<AchievementDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

            index: true,

        },

        facultyId: {

            type: Schema.Types.ObjectId,

            ref: "Faculty",

        },

        title: {

            type: String,

            required: true,

            trim: true,

        },

        description: {

            type: String,

            trim: true,

        },

        category: {

            type: String,

            trim: true,

        },

        level: {

            type: String,

            enum: ["COLLEGE", "STATE", "NATIONAL", "INTERNATIONAL"],

        },

        position: {

            type: String,

            trim: true,

        },

        certificateUrl: {

            type: String,

            trim: true,

        },

        proofUrl: {

            type: String,

            trim: true,

        },

        achievementDate: {

            type: Date,

            required: true,

        },

        verifiedBy: {

            type: Schema.Types.ObjectId,

            ref: "User",

        },

        status: {

            type: String,

            enum: ["PENDING", "VERIFIED", "REJECTED"],

            default: "PENDING",

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const AchievementModel = mongoose.model<AchievementDocument>(

    "Achievement",

    AchievementSchema

);
