import mongoose, { Schema, Document } from "mongoose";

export interface ResumeTemplateDocument extends Document {

    name: string;

    thumbnail?: string;

    templateFile?: string;

    premium: boolean;

    createdAt: Date;

}

const ResumeTemplateSchema = new Schema<ResumeTemplateDocument>(

    {

        name: {

            type: String,

            required: true,

            trim: true,

            unique: true,

        },

        thumbnail: {

            type: String,

            trim: true,

        },

        templateFile: {

            type: String,

            trim: true,

        },

        premium: {

            type: Boolean,

            default: false,

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

export const ResumeTemplateModel = mongoose.model<ResumeTemplateDocument>(

    "ResumeTemplate",

    ResumeTemplateSchema

);
