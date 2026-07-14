import mongoose, { Schema, Document } from "mongoose";

export interface BadgeDocument extends Document {

    name: string;

    description?: string;

    icon?: string;

    criteria?: string;

    points: number;

    createdAt: Date;

    updatedAt: Date;

}

const BadgeSchema = new Schema<BadgeDocument>(

    {

        name: {

            type: String,

            required: true,

            trim: true,

            unique: true,

        },

        description: {

            type: String,

            trim: true,

        },

        icon: {

            type: String,

            trim: true,

        },

        criteria: {

            type: String,

            trim: true,

        },

        points: {

            type: Number,

            default: 0,

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const BadgeModel = mongoose.model<BadgeDocument>(

    "Badge",

    BadgeSchema

);
