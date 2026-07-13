import mongoose, { Schema, Document } from "mongoose";

export interface ClubMemberDocument extends Document {

    clubId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    role: string;

    joinedAt: Date;

    status: string;

}

const ClubMemberSchema = new Schema<ClubMemberDocument>(

    {

        clubId: {

            type: Schema.Types.ObjectId,

            ref: "Club",

            required: true,

            index: true,

        },

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

            index: true,

        },

        role: {

            type: String,

            enum: ["MEMBER", "PRESIDENT", "VICE_PRESIDENT"],

            default: "MEMBER",

        },

        joinedAt: {

            type: Date,

            required: true,

        },

        status: {

            type: String,

            enum: ["ACTIVE", "INACTIVE"],

            default: "ACTIVE",

        },

    },

    {

        versionKey: false,

    }

);

ClubMemberSchema.index(

    {

        clubId: 1,

        studentId: 1,

    },

    {

        unique: true,

    }

);

export const ClubMemberModel = mongoose.model<ClubMemberDocument>(

    "ClubMember",

    ClubMemberSchema

);
