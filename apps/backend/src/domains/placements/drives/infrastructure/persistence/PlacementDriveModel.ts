import mongoose, { Schema, Document } from "mongoose";

export interface PlacementDriveDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    companyId: mongoose.Types.ObjectId;

    title: string;

    description?: string;

    package?: string;

    location?: string;

    eligibility?: string;

    eligibilityCriteria?: {
        departmentIds?: mongoose.Types.ObjectId[];
        minCgpa?: number;
        minSemester?: number;
        batches?: string[];
    };

    deadline?: Date;

    status: string;

    createdAt: Date;

    updatedAt: Date;

}

const PlacementDriveSchema = new Schema<PlacementDriveDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        companyId: {

            type: Schema.Types.ObjectId,

            ref: "Company",

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

        package: {

            type: String,

            trim: true,

        },

        location: {

            type: String,

            trim: true,

        },

        eligibility: {

            type: String,

            trim: true,

        },

        eligibilityCriteria: {

            departmentIds: [{ type: Schema.Types.ObjectId, ref: "Department" }],

            minCgpa: { type: Number },

            minSemester: { type: Number },

            batches: [{ type: String }],

        },

        deadline: {

            type: Date,

        },

        status: {

            type: String,

            enum: ["DRAFT", "PUBLISHED", "CLOSED"],

            default: "DRAFT",

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const PlacementDriveModel = mongoose.model<PlacementDriveDocument>(

    "PlacementDrive",

    PlacementDriveSchema

);
