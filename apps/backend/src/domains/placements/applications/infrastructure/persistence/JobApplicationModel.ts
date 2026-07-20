import mongoose, { Schema, Document } from "mongoose";

export interface JobApplicationDocument extends Document {

    placementId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    resume?: string;

    status: string;

    remarks?: string;

    appliedAt: Date;

}

const JobApplicationSchema = new Schema<JobApplicationDocument>(

    {

        placementId: {

            type: Schema.Types.ObjectId,

            ref: "PlacementDrive",

            required: true,

            index: true,

        },

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

            index: true,

        },

        resume: {

            type: String,

            trim: true,

        },

        status: {

            type: String,

            enum: ["APPLIED", "SHORTLISTED", "REJECTED", "SELECTED"],

            default: "APPLIED",

        },

        remarks: {

            type: String,

            trim: true,

        },

        appliedAt: {

            type: Date,

            required: true,

        },

    },

    {

        versionKey: false,

    }

);

JobApplicationSchema.index(

    {

        placementId: 1,

        studentId: 1,

    },

    {

        unique: true,

    }

);

export const JobApplicationModel = mongoose.model<JobApplicationDocument>(

    "JobApplication",

    JobApplicationSchema

);
