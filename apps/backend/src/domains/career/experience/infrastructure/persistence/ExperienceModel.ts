import mongoose, { Schema, Document } from "mongoose";

export interface ExperienceDocument extends Document {

    userId: mongoose.Types.ObjectId;

    company: string;

    role: string;

    employmentType?: string;

    location?: string;

    startDate: Date;

    endDate?: Date;

    currentlyWorking: boolean;

    description?: string;

    skills: string[];

    createdAt: Date;

    updatedAt: Date;

}

const ExperienceSchema = new Schema<ExperienceDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },

        company: {

            type: String,

            required: true,

            trim: true,

        },

        role: {

            type: String,

            required: true,

            trim: true,

        },

        employmentType: {

            type: String,

            enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"],

        },

        location: {

            type: String,

            trim: true,

        },

        startDate: {

            type: Date,

            required: true,

        },

        endDate: {

            type: Date,

        },

        currentlyWorking: {

            type: Boolean,

            default: false,

        },

        description: {

            type: String,

            trim: true,

        },

        skills: [{

            type: String,

        }],

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const ExperienceModel = mongoose.model<ExperienceDocument>(

    "Experience",

    ExperienceSchema

);
