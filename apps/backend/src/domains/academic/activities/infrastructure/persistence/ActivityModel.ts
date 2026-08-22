import mongoose, { Schema } from "mongoose";

import { ActivityStatus } from "../../domain/constants/ActivityStatus.js";
import { ActivityType } from "../../domain/constants/ActivityType.js";
import { ActivityVisibility } from "../../domain/constants/ActivityVisibility.js";

const attachmentSchema = new Schema(

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

const activitySchema = new Schema(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true

        },

        createdBy: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        title: {

            type: String,

            required: true,

            trim: true

        },

        description: {

            type: String,

            default: ""

        },

        type: {

            type: String,

            enum: Object.values(ActivityType),

            required: true

        },

        status: {

            type: String,

            enum: Object.values(ActivityStatus),

            default: ActivityStatus.DRAFT

        },

        visibility: {

            type: String,

            enum: Object.values(ActivityVisibility),

            default: ActivityVisibility.PUBLIC

        },

        departmentIds: {

            type: [String],

            default: undefined

        },

        batches: {

            type: [String],

            default: undefined

        },

        points: {

            type: Number,

            default: 0

        },

        penaltyPoints: {

            type: Number,

            default: 0

        },

        startDate: {

            type: Date,

            required: true

        },

        endDate: {

            type: Date,

            required: true

        },

        attachments: {

            type: [attachmentSchema],

            default: []

        }

    },

    {

        timestamps: true

    }

);

export type ActivityDocument =
    mongoose.HydratedDocument<any>;

export const ActivityModel =
    mongoose.model(
        "Activity",
        activitySchema
    );