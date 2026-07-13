import mongoose, { Schema, Document } from "mongoose";

export interface AlumniDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    userId?: mongoose.Types.ObjectId;

    email: string;

    name?: string;

    graduationYear?: number;

    company?: string;

    designation?: string;

    isVerified: boolean;

    status: string;

    inviteTokenHash?: string;

    inviteExpiresAt?: Date;

    createdAt: Date;

    updatedAt: Date;

}

const AlumniSchema = new Schema<AlumniDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

        },

        email: {

            type: String,

            required: true,

            trim: true,

            lowercase: true,

        },

        name: {

            type: String,

            trim: true,

        },

        graduationYear: {

            type: Number,

        },

        company: {

            type: String,

            trim: true,

        },

        designation: {

            type: String,

            trim: true,

        },

        isVerified: {

            type: Boolean,

            default: false,

        },

        status: {

            type: String,

            enum: ["INVITED", "ACTIVE"],

            default: "ACTIVE",

        },

        inviteTokenHash: {

            type: String,

            select: false,

        },

        inviteExpiresAt: {

            type: Date,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

AlumniSchema.index(

    {

        organizationId: 1,

        email: 1,

    },

    {

        unique: true,

    }

);

export const AlumniModel = mongoose.model<AlumniDocument>(

    "Alumni",

    AlumniSchema

);
