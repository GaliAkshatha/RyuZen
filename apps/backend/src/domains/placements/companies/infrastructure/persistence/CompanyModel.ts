import mongoose, { Schema, Document } from "mongoose";

export interface CompanyDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    name: string;

    logo?: string;

    website?: string;

    description?: string;

    hrName?: string;

    hrEmail?: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;

}

const CompanySchema = new Schema<CompanyDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        name: {

            type: String,

            required: true,

            trim: true,

        },

        logo: {

            type: String,

            trim: true,

        },

        website: {

            type: String,

            trim: true,

        },

        description: {

            type: String,

            trim: true,

        },

        hrName: {

            type: String,

            trim: true,

        },

        hrEmail: {

            type: String,

            trim: true,

            lowercase: true,

        },

        status: {

            type: String,

            enum: ["ACTIVE", "INACTIVE"],

            default: "ACTIVE",

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

CompanySchema.index(

    {

        organizationId: 1,

        name: 1,

    },

    {

        unique: true,

    }

);

export const CompanyModel = mongoose.model<CompanyDocument>(

    "Company",

    CompanySchema

);
