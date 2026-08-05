import mongoose, { Schema, Document } from "mongoose";

export interface PointLedgerDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    transactionId: string;

    studentId: mongoose.Types.ObjectId;

    activityId?: mongoose.Types.ObjectId;

    points: number;

    reason: string;

    timestamp: Date;

    previousHash: string;

    hash: string;

    createdAt: Date;

}

const PointLedgerSchema = new Schema<PointLedgerDocument>(

    {

        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        transactionId: {
            type: String,
            required: true,
            unique: true,
        },

        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            index: true,
        },

        activityId: {
            type: Schema.Types.ObjectId,
            ref: "Activity",
        },

        points: {
            type: Number,
            required: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        timestamp: {
            type: Date,
            required: true,
        },

        previousHash: {
            type: String,
            required: true,
        },

        hash: {
            type: String,
            required: true,
            unique: true,
        },

    },

    {

        // No `updatedAt` - this collection is genuinely append-only.
        // Nothing in this codebase ever calls an update/delete
        // operation against it (confirmed: PointLedgerRepository below
        // exposes only `create` and read methods, no `save`/`delete`).
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,

    }

);

// Supports "give me this organization's chain in order" (audit +
// hash-verification) and "find the latest entry to chain onto next".
PointLedgerSchema.index(
    { organizationId: 1, timestamp: 1 }
);

PointLedgerSchema.index(
    { organizationId: 1, studentId: 1, timestamp: -1 }
);

export const PointLedgerModel = mongoose.model<PointLedgerDocument>(

    "PointLedgerEntry",

    PointLedgerSchema

);
