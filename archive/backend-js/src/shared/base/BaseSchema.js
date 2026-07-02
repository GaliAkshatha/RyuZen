import mongoose from "mongoose";

/**
 * Creates reusable schema fields that every business model can inherit.
 *
 * Example:
 *
 * activitySchema.add(createBaseSchema());
 */

export default function createBaseSchema() {

    return {

        organization: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        createdBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        updatedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },

        deletedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },

        isDeleted: {

            type: Boolean,

            default: false,

            index: true,

        },

        deletedAt: {

            type: Date,

            default: null,

        },

    };

}