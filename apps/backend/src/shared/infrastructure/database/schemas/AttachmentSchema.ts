import { Schema } from "mongoose";

export const AttachmentSchema = new Schema(

    {

        name: {

            type: String,

            required: true

        },

        url: {

            type: String,

            required: true

        },

        mimeType: {

            type: String,

            required: true

        }

    },

    {

        _id: false

    }

);