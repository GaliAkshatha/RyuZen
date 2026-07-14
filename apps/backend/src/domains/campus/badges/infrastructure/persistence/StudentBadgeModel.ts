import mongoose, { Schema, Document } from "mongoose";

export interface StudentBadgeDocument extends Document {

    studentId: mongoose.Types.ObjectId;

    badgeId: mongoose.Types.ObjectId;

    awardedBy: mongoose.Types.ObjectId;

    awardedAt: Date;

}

const StudentBadgeSchema = new Schema<StudentBadgeDocument>(

    {

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

            index: true,

        },

        badgeId: {

            type: Schema.Types.ObjectId,

            ref: "Badge",

            required: true,

        },

        awardedBy: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        awardedAt: {

            type: Date,

            required: true,

        },

    },

    {

        versionKey: false,

    }

);

StudentBadgeSchema.index(

    {

        studentId: 1,

        badgeId: 1,

    },

    {

        unique: true,

    }

);

export const StudentBadgeModel = mongoose.model<StudentBadgeDocument>(

    "StudentBadge",

    StudentBadgeSchema

);
