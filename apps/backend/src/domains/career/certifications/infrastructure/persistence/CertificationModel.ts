import mongoose, { Schema, Document } from "mongoose";

export interface CertificationDocument extends Document {

    userId: mongoose.Types.ObjectId;

    title: string;

    issuer: string;

    credentialId?: string;

    issueDate: Date;

    expiryDate?: Date;

    credentialUrl?: string;

    skills: string[];

    createdAt: Date;

    updatedAt: Date;

}

const CertificationSchema = new Schema<CertificationDocument>(

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

        issuer: {

            type: String,

            required: true,

            trim: true,

        },

        credentialId: {

            type: String,

            trim: true,

        },

        issueDate: {

            type: Date,

            required: true,

        },

        expiryDate: {

            type: Date,

        },

        credentialUrl: {

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

export const CertificationModel = mongoose.model<CertificationDocument>(

    "Certification",

    CertificationSchema

);
