import mongoose, { Schema, Document } from "mongoose";

export interface FacultyDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    userId: mongoose.Types.ObjectId;

    departmentId?: mongoose.Types.ObjectId;

    employeeId: string;

    designation: string;

    specialization?: string;

    status: string;

    joinedAt?: Date;

    createdAt: Date;

    updatedAt: Date;

}

const FacultySchema = new Schema<FacultyDocument>(

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

        },

        departmentId: {

            type: Schema.Types.ObjectId,

            ref: "Department",

        },

        employeeId: {

            type: String,

            required: true,

            trim: true,

        },

        designation: {

            type: String,

            required: true,

            trim: true,

        },

        specialization: {

            type: String,

            trim: true,

        },

        status: {

            type: String,

            enum: ["ACTIVE", "INACTIVE"],

            default: "ACTIVE",

        },

        joinedAt: {

            type: Date,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

FacultySchema.index(

    {

        organizationId: 1,

        employeeId: 1,

    },

    {

        unique: true,

    }

);

export const FacultyModel = mongoose.model<FacultyDocument>(

    "Faculty",

    FacultySchema

);