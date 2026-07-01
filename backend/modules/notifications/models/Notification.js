import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(

    {

        user: {

            type:

                mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },

        title: {

            type: String,

            required: true,

            trim: true,

        },

        message: {

            type: String,

            required: true,

            trim: true,

        },

        isRead: {

            type: Boolean,

            default: false,

        },

        isDeleted: {

            type: Boolean,

            default: false,

        },

    },

    {

        timestamps: true,

    }

);

notificationSchema.index({

    user: 1,

    createdAt: -1,

});

export default mongoose.model(

    "Notification",

    notificationSchema

);