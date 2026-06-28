import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(

    {

        participants: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true,

            },

        ],

        isGroup: {

            type: Boolean,

            default: false,

        },

        groupName: {

            type: String,

            default: null,

        },

        groupAvatar: {

            type: String,

            default: null,

        },

        lastMessage: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Message",

            default: null,

        },

        lastActivity: {

            type: Date,

            default: Date.now,

        },

    },

    {

        timestamps: true,

    }

);

conversationSchema.index({

    participants: 1,

});

export default mongoose.model(
    "Conversation",
    conversationSchema
);