import mongoose, {

    HydratedDocument,

    Schema

} from "mongoose";

import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

import { AttachmentSchema } from "../../../../../shared/infrastructure/database/schemas/AttachmentSchema.js";

export interface SubmissionPersistence {

    activityId: mongoose.Types.ObjectId;

    organizationId: mongoose.Types.ObjectId;

    submittedBy: mongoose.Types.ObjectId;

    status: SubmissionStatus;

    remarks: string;

    attachments: {

        name: string;

        url: string;

        mimeType: string;

    }[];

    review: {

        reviewedBy: mongoose.Types.ObjectId | null;

        reviewedAt?: Date;

        feedback: string;

        pointsAwarded: number;

    };

    submittedAt: Date;

    createdAt: Date;

    updatedAt: Date;

}

const ReviewSchema = new Schema(

    {

        reviewedBy: {

            type: Schema.Types.ObjectId,

            ref: "User",

            default: null

        },

        reviewedAt: Date,

        feedback: {

            type: String,

            default: ""

        },

        pointsAwarded: {

            type: Number,

            default: 0

        }

    },

    {

        _id: false

    }

);

const SubmissionSchema = new Schema(

    {

        activityId: {

            type: Schema.Types.ObjectId,

            ref: "Activity",

            required: true

        },

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true

        },

        submittedBy: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        status: {

            type: String,

            enum: Object.values(

                SubmissionStatus

            ),

            default:

                SubmissionStatus.PENDING

        },

        remarks: {

            type: String,

            default: ""

        },

        attachments: {

            type: [AttachmentSchema],

            default: []

        },

        review: {

            type: ReviewSchema,

            default: {}

        },

        submittedAt: {

            type: Date,

            required: true

        }

    },

    {

        timestamps: true

    }

);

SubmissionSchema.index(

    {

        activityId: 1,

        submittedBy: 1

    },

    {

        unique: true

    }

);

export type SubmissionDocument =

    HydratedDocument<SubmissionPersistence>;

export const SubmissionModel =

    mongoose.model<SubmissionPersistence>(

        "Submission",

        SubmissionSchema

    );