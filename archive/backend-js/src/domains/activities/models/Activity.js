import mongoose from "mongoose";

import {

    ACTIVITY_STATUS,

    ACTIVITY_TYPE,

} from "../constants/activityConstants.js";

const configurationSchema = new mongoose.Schema(

    {

        venue: {

            type: String,

            trim: true,

            default: "",

        },

        startTime: {

            type: String,

            default: "",

        },

        endTime: {

            type: String,

            default: "",

        },

        attendanceMethod: {

            type: String,

            default: "",

        },

        registrationDeadline: {

            type: Date,

            default: null,

        },

        instructions: {

            type: String,

            trim: true,

            default: "",

        },

        submissionType: {

            type: String,

            default: "",

        },

        formFields: [

            {

                label: {

                    type: String,

                    required: true,

                },

                type: {

                    type: String,

                    required: true,

                },

                required: {

                    type: Boolean,

                    default: false,

                },

                options: [

                    {

                        type: String,

                    },

                ],

            },

        ],

    },

    {

        _id: false,

    }

);

const rulesSchema = new mongoose.Schema(

    {

        points: {

            type: Number,

            default: 0,

            min: 0,

        },

        penaltyPoints: {

            type: Number,

            default: 0,

            min: 0,

        },

        maxParticipants: {

            type: Number,

            default: 0,

            min: 0,

        },

    },

    {

        _id: false,

    }

);

const statisticsSchema = new mongoose.Schema(

    {

        registrations: {

            type: Number,

            default: 0,

        },

        submissions: {

            type: Number,

            default: 0,

        },

        completed: {

            type: Number,

            default: 0,

        },

    },

    {

        _id: false,

    }

);

const activitySchema = new mongoose.Schema(

    {

        organization: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        title: {

            type: String,

            required: true,

            trim: true,

            maxlength: 150,

        },

        description: {

            type: String,

            trim: true,

            default: "",

        },

        type: {

            type: String,

            enum: Object.values(ACTIVITY_TYPE),

            required: true,

            index: true,

        },

        status: {

            type: String,

            enum: Object.values(ACTIVITY_STATUS),

            default: ACTIVITY_STATUS.DRAFT,

            index: true,

        },

        config: {

            type: configurationSchema,

            default: () => ({}),

        },

        rules: {

            type: rulesSchema,

            default: () => ({}),

        },

        statistics: {

            type: statisticsSchema,

            default: () => ({}),

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

        publishedAt: {

            type: Date,

            default: null,

        },

        closedAt: {

            type: Date,

            default: null,

        },

        archivedAt: {

            type: Date,

            default: null,

        },

        isDeleted: {

            type: Boolean,

            default: false,

            index: true,

        },

    },

    {

        timestamps: true,

    }

);

/*  Indexes  */

activitySchema.index({

    organization: 1,

    status: 1,

});

activitySchema.index({

    organization: 1,

    type: 1,

});

activitySchema.index({

    title: "text",

    description: "text",

});

/* -------------------------------------------------------------------------- */

export default mongoose.model(

    "Activity",

    activitySchema

);