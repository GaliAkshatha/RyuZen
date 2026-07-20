import mongoose, { Schema, Document } from "mongoose";

export interface UserPortfolioDocument extends Document {

    userId: mongoose.Types.ObjectId;

    headline?: string;

    summary?: string;

    github?: string;

    linkedin?: string;

    leetcode?: string;

    codeforces?: string;

    portfolio?: string;

    behance?: string;

    dribbble?: string;

    website?: string;

    visibility: string;

    theme?: string;

    createdAt: Date;

    updatedAt: Date;

}

const UserPortfolioSchema = new Schema<UserPortfolioDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            unique: true,

        },

        headline: {

            type: String,

            trim: true,

        },

        summary: {

            type: String,

            trim: true,

        },

        github: {

            type: String,

            trim: true,

        },

        linkedin: {

            type: String,

            trim: true,

        },

        leetcode: {

            type: String,

            trim: true,

        },

        codeforces: {

            type: String,

            trim: true,

        },

        portfolio: {

            type: String,

            trim: true,

        },

        behance: {

            type: String,

            trim: true,

        },

        dribbble: {

            type: String,

            trim: true,

        },

        website: {

            type: String,

            trim: true,

        },

        visibility: {

            type: String,

            enum: ["PUBLIC", "PRIVATE"],

            default: "PUBLIC",

        },

        theme: {

            type: String,

            trim: true,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const UserPortfolioModel = mongoose.model<UserPortfolioDocument>(

    "UserPortfolio",

    UserPortfolioSchema

);
