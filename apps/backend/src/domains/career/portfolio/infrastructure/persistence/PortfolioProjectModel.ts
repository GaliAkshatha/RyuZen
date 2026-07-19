import mongoose, { Schema, Document } from "mongoose";

export interface PortfolioProjectDocument extends Document {

    userId: mongoose.Types.ObjectId;

    title: string;

    description?: string;

    techStack: string[];

    github?: string;

    liveDemo?: string;

    images: string[];

    video?: string;

    featured: boolean;

    createdAt: Date;

    updatedAt: Date;

}

const PortfolioProjectSchema = new Schema<PortfolioProjectDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

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

        techStack: [{

            type: String,

        }],

        github: {

            type: String,

            trim: true,

        },

        liveDemo: {

            type: String,

            trim: true,

        },

        images: [{

            type: String,

        }],

        video: {

            type: String,

            trim: true,

        },

        featured: {

            type: Boolean,

            default: false,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const PortfolioProjectModel = mongoose.model<PortfolioProjectDocument>(

    "PortfolioProject",

    PortfolioProjectSchema

);
