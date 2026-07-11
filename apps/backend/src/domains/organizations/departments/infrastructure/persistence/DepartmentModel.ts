import mongoose, { Document, Schema } from "mongoose";

import { DepartmentStatus } from "../../domain/constants/DepartmentStatus.js";

export interface DepartmentDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    name: string;

    code: string;

    description?: string;

    headId?: mongoose.Types.ObjectId;

    status: DepartmentStatus;

    createdAt: Date;

    updatedAt: Date;

}

const DepartmentSchema = new Schema<DepartmentDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true

        },

        name: {

            type: String,

            required: true,

            trim: true

        },

        code: {

            type: String,

            required: true,

            uppercase: true,

            trim: true

        },

        description: {

            type: String,

            default: ""

        },

        headId: {

            type: Schema.Types.ObjectId,

            ref: "User"

        },

        status: {

            type: String,

            enum: Object.values(DepartmentStatus),

            default: DepartmentStatus.ACTIVE,

            index: true

        }

    },

    {

        timestamps: true,

        versionKey: false

    }

);

DepartmentSchema.index({

    organizationId: 1,

    code: 1

}, {

    unique: true

});

export const DepartmentModel = mongoose.model<DepartmentDocument>(

    "Department",

    DepartmentSchema

);