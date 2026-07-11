import mongoose, { Document, Schema } from "mongoose";

import { FacultyDesignation } from "../../domain/constants/FacultyDesignation.js";
import { FacultyStatus } from "../../domain/constants/FacultyStatus.js";

export interface FacultyDocument extends Document {

    userId: mongoose.Types.ObjectId;

    organizationId: mongoose.Types.ObjectId;

    departmentId: mongoose.Types.ObjectId;

    employeeId: string;

    designation: FacultyDesignation;

    joiningDate: Date;

    status: FacultyStatus;

    createdAt: Date;

    updatedAt: Date;

}

const FacultySchema = new Schema<FacultyDocument>(

    {

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

            unique: true,

            index: true

        },

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true

        },

        departmentId: {

            type: Schema.Types.ObjectId,

            ref: "Department",

            required: true,

            index: true

        },

        employeeId: {

            type: String,

            required: true,

            trim: true,

            uppercase: true

        },

        designation: {

            type: String,

            enum: Object.values(FacultyDesignation),

            required: true

        },

        joiningDate: {

            type: Date,

            required: true

        },

        status: {

            type: String,

            enum: Object.values(FacultyStatus),

            default: FacultyStatus.ACTIVE,

            index: true

        }

    },

    {

        timestamps: true,

        versionKey: false

    }

);

FacultySchema.index({

    organizationId: 1,

    employeeId: 1

}, {

    unique: true

});

export const FacultyModel = mongoose.model<FacultyDocument>(

    "Faculty",

    FacultySchema

);