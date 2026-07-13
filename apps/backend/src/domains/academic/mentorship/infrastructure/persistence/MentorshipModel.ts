import mongoose, { Schema, Document } from "mongoose";

export interface MentorshipDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    facultyId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    assignedBy: mongoose.Types.ObjectId;

    assignedDate: Date;

    status: string;

    remarks?: string;

    createdAt: Date;

    updatedAt: Date;

}

const MentorshipSchema = new Schema<MentorshipDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        facultyId: {

            type: Schema.Types.ObjectId,

            ref: "Faculty",

            required: true,

            index: true,

        },

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

            index: true,

        },

        assignedBy: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        assignedDate: {

            type: Date,

            required: true,

        },

        status: {

            type: String,

            enum: ["ACTIVE", "COMPLETED", "CANCELLED"],

            default: "ACTIVE",

        },

        remarks: {

            type: String,

            trim: true,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const MentorshipModel = mongoose.model<MentorshipDocument>(

    "Mentorship",

    MentorshipSchema

);
