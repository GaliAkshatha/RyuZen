import mongoose, { Schema, Document } from "mongoose";

export interface StudentDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    userId: mongoose.Types.ObjectId;

    departmentId?: mongoose.Types.ObjectId;

    mentorId?: mongoose.Types.ObjectId;

    usn: string;

    batch: string;

    semester: number;

    cgpa?: number;

    section?: string;

    admissionYear?: number;

    graduationYear?: number;

    tenthPercentage?: number;

    twelfthPercentage?: number;

    entranceRank?: number;

    status: string;

    joinedAt?: Date;

    createdAt: Date;

    updatedAt: Date;

}

const StudentSchema = new Schema<StudentDocument>(

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

        mentorId: {

            type: Schema.Types.ObjectId,

            ref: "Faculty",

        },

        usn: {

            type: String,

            required: true,

            trim: true,

            uppercase: true,

        },

        batch: {

            type: String,

            required: true,

            trim: true,

        },

        semester: {

            type: Number,

            required: true,

            default: 1,

        },

        cgpa: {

            type: Number,

        },

        section: {

            type: String,

        },

        admissionYear: {

            type: Number,

        },

        graduationYear: {

            type: Number,

        },

        tenthPercentage: {

            type: Number,

        },

        twelfthPercentage: {

            type: Number,

        },

        entranceRank: {

            type: Number,

        },

        status: {

            type: String,

            enum: ["ACTIVE", "ARCHIVED"],

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

StudentSchema.index(

    {

        organizationId: 1,

        usn: 1,

    },

    {

        unique: true,

    }

);

export const StudentModel = mongoose.model<StudentDocument>(

    "Student",

    StudentSchema

);
