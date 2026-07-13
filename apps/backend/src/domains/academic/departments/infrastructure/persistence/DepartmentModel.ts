import mongoose, { Schema, Document } from "mongoose";

export interface DepartmentDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    name: string;

    code: string;

    description?: string;

    headOfDepartmentId?: mongoose.Types.ObjectId;

    createdAt: Date;

    updatedAt: Date;

}

const DepartmentSchema = new Schema<DepartmentDocument>(

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

        code: {

            type: String,

            required: true,

            trim: true,

            uppercase: true,

        },

        description: {

            type: String,

            default: "",

        },

        headOfDepartmentId: {

            type: Schema.Types.ObjectId,

            ref: "User",

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

DepartmentSchema.index(

    {

        organizationId: 1,

        code: 1,

    },

    {

        unique: true,

    }

);

export const DepartmentModel = mongoose.model<DepartmentDocument>(

    "Department",

    DepartmentSchema

);