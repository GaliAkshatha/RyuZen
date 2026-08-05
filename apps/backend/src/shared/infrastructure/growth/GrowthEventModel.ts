import mongoose, { Schema, Document } from "mongoose";

export interface GrowthEventDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    domain: string;

    eventType: string;

    evidence: {
        entityType: string;
        entityId: string;
    };

    verifiedBy: string;

    contributionWeight: number;

    occurredAt: Date;

}

const GrowthEventSchema = new Schema<GrowthEventDocument>(

    {

        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            index: true,
        },

        domain: {
            type: String,
            required: true,
        },

        eventType: {
            type: String,
            required: true,
        },

        evidence: {
            entityType: { type: String, required: true },
            entityId: { type: String, required: true },
        },

        verifiedBy: {
            type: String,
            required: true,
        },

        contributionWeight: {
            type: Number,
            required: true,
            default: 0,
        },

        occurredAt: {
            type: Date,
            required: true,
        },

    },

    {

        // No updatedAt - genuinely append-only, matching PointLedger
        // and AuditLog. No update/delete exists anywhere in
        // IGrowthEventRepository, so this is enforced at the interface
        // level too, not just by convention here.
        timestamps: false,
        versionKey: false,

    }

);

// Supports "this student's full timeline" (read) and "everything from
// this domain this org has recorded" (future analytics/AI consumers).
GrowthEventSchema.index({ organizationId: 1, studentId: 1, occurredAt: -1 });
GrowthEventSchema.index({ organizationId: 1, domain: 1 });

export const GrowthEventModel = mongoose.model<GrowthEventDocument>(

    "GrowthEvent",

    GrowthEventSchema

);
