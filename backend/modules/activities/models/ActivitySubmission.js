import mongoose from "mongoose";

import {

    SUBMISSION_STATUS,

} from "../constants/activityConstants.js";

const activitySubmissionSchema = new mongoose.Schema(

    {

        activity: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Activity",

            required: true,

            index: true,

        },

        organization: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        student: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },

        answers: {

            type: Map,

            of: mongoose.Schema.Types.Mixed,

            default: new Map(),

        },

        attachment: {

            type: String,

            default: null,

        },

        score: {

            type: Number,

            default: 0,

            min: 0,

        },

        feedback: {

            type: String,

            trim: true,

            default: "",

        },

        status: {

            type: String,

            enum: Object.values(

                SUBMISSION_STATUS

            ),

            default:

                SUBMISSION_STATUS.SUBMITTED,

            index: true,

        },

        reviewedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },

        reviewedAt: {

            type: Date,

            default: null,

        },

        submittedAt: {

            type: Date,

            default: Date.now,

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

/**
 * One student can only submit once.
 */

activitySubmissionSchema.index(

    {

        activity: 1,

        student: 1,

    },

    {

        unique: true,

    }

);

/**
 * Used for dashboards.
 */

activitySubmissionSchema.index({

    organization: 1,

    status: 1,

});

export default mongoose.model(

    "ActivitySubmission",

    activitySubmissionSchema

);