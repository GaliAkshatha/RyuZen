import mongoose, { Schema, Document } from "mongoose";

export interface LeaderboardEntryDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    activityPoints: number;

    clubPoints: number;

    eventPoints: number;

    placementPoints: number;

    totalPoints: number;

    rank: number;

    createdAt: Date;

    updatedAt: Date;

}

const LeaderboardEntrySchema = new Schema<LeaderboardEntryDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

        },

        activityPoints: {

            type: Number,

            default: 0,

        },

        clubPoints: {

            type: Number,

            default: 0,

        },

        eventPoints: {

            type: Number,

            default: 0,

        },

        placementPoints: {

            type: Number,

            default: 0,

        },

        totalPoints: {

            type: Number,

            default: 0,

            index: true,

        },

        rank: {

            type: Number,

            default: 0,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

LeaderboardEntrySchema.index(

    {

        organizationId: 1,

        studentId: 1,

    },

    {

        unique: true,

    }

);

export const LeaderboardEntryModel = mongoose.model<LeaderboardEntryDocument>(

    "LeaderboardEntry",

    LeaderboardEntrySchema

);
