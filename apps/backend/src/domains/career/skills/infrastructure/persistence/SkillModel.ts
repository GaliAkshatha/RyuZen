import mongoose, { Schema, Document } from "mongoose";

export interface SkillDocument extends Document {

    userId: mongoose.Types.ObjectId;

    name: string;

    category?: string;

    level?: string;

    verified: boolean;

    source: string;

    confidence?: number;

    evidence?: string;

    approved: boolean;

    createdAt: Date;

    updatedAt: Date;

}

const SkillSchema = new Schema<SkillDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },

        name: {

            type: String,

            required: true,

            trim: true,

        },

        category: {

            type: String,

            trim: true,

        },

        level: {

            type: String,

            enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],

        },

        verified: {

            type: Boolean,

            default: false,

        },

        source: {

            type: String,

            enum: ["MANUAL", "AI_SUGGESTED"],

            default: "MANUAL",

        },

        confidence: {

            type: Number,

            min: 0,

            max: 100,

        },

        evidence: {

            type: String,

            trim: true,

        },

        approved: {

            type: Boolean,

            default: true,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

SkillSchema.index(

    {

        userId: 1,

        name: 1,

    },

    {

        unique: true,

    }

);

export const SkillModel = mongoose.model<SkillDocument>(

    "Skill",

    SkillSchema

);
