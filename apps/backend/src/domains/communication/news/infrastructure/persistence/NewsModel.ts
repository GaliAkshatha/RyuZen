import mongoose, { Schema, Document } from "mongoose";

export interface NewsDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    authorId: mongoose.Types.ObjectId;

    authorName: string;

    authorRole: string;

    title: string;

    content: string;

    createdAt: Date;

    updatedAt: Date;

}

const NewsSchema = new Schema<NewsDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        authorId: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        authorName: {

            type: String,

            required: true,

            trim: true,

        },

        authorRole: {

            type: String,

            required: true,

        },

        title: {

            type: String,

            required: true,

            trim: true,

        },

        content: {

            type: String,

            required: true,

            trim: true,

        },

    },

    {

        timestamps: true,

    }

);

export const NewsModel = mongoose.model<NewsDocument>("News", NewsSchema);
