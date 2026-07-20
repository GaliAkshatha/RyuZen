import mongoose, { Schema, Document } from "mongoose";

export interface EducationDocument extends Document {

    userId: mongoose.Types.ObjectId;

    institution: string;

    degree: string;

    branch?: string;

    cgpa?: number;

    startYear: number;

    endYear?: number;

    createdAt: Date;

    updatedAt: Date;

}

const EducationSchema = new Schema<EducationDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },

        institution: {

            type: String,

            required: true,

            trim: true,

        },

        degree: {

            type: String,

            required: true,

            trim: true,

        },

        branch: {

            type: String,

            trim: true,

        },

        cgpa: {

            type: Number,

        },

        startYear: {

            type: Number,

            required: true,

        },

        endYear: {

            type: Number,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const EducationModel = mongoose.model<EducationDocument>(

    "Education",

    EducationSchema

);
