import mongoose, { Schema, Document } from "mongoose";

export interface RecruiterDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    userId: mongoose.Types.ObjectId;

    companyId: mongoose.Types.ObjectId;

    jobTitle?: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;

}

const RecruiterSchema = new Schema<RecruiterDocument>(

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
            required: true,
            unique: true,
            index: true,
        },

        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true,
        },

        jobTitle: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "ARCHIVED"],
            default: "ACTIVE",
        },

    },

    {

        timestamps: true,
        versionKey: false,

    }

);

RecruiterSchema.index({ organizationId: 1, companyId: 1 });

export const RecruiterModel = mongoose.model<RecruiterDocument>(

    "Recruiter",

    RecruiterSchema

);
