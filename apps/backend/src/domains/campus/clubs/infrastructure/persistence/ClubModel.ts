import mongoose, { Schema, Document } from "mongoose";

export interface ClubDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    name: string;

    code: string;

    description?: string;

    logo?: string;

    facultyAdvisorId?: mongoose.Types.ObjectId;

    presidentStudentId?: mongoose.Types.ObjectId;

    vicePresidentStudentId?: mongoose.Types.ObjectId;

    status: string;

    createdAt: Date;

    updatedAt: Date;

}

const ClubSchema = new Schema<ClubDocument>(

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

            trim: true,

        },

        logo: {

            type: String,

            trim: true,

        },

        facultyAdvisorId: {

            type: Schema.Types.ObjectId,

            ref: "Faculty",

        },

        presidentStudentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

        },

        vicePresidentStudentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

        },

        status: {

            type: String,

            enum: ["ACTIVE", "INACTIVE"],

            default: "ACTIVE",

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

ClubSchema.index(

    {

        organizationId: 1,

        code: 1,

    },

    {

        unique: true,

    }

);

export const ClubModel = mongoose.model<ClubDocument>(

    "Club",

    ClubSchema

);
