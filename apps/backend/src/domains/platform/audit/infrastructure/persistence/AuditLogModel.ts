import mongoose, { Schema, Document } from "mongoose";

export interface AuditLogDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    userId?: mongoose.Types.ObjectId;

    action: string;

    entityType?: string;

    entityId?: string;

    method: string;

    path: string;

    statusCode: number;

    ipAddress?: string;

    userAgent?: string;

    metadata?: Record<string, unknown>;

    createdAt: Date;

}

const AuditLogSchema = new Schema<AuditLogDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        userId: {

            type: Schema.Types.ObjectId,

            ref: "User",

        },

        action: {

            type: String,

            required: true,

            trim: true,

            index: true,

        },

        entityType: {

            type: String,

            trim: true,

        },

        entityId: {

            type: String,

            trim: true,

        },

        method: {

            type: String,

            required: true,

        },

        path: {

            type: String,

            required: true,

        },

        statusCode: {

            type: Number,

            required: true,

        },

        ipAddress: {

            type: String,

        },

        userAgent: {

            type: String,

        },

        metadata: {

            type: Schema.Types.Mixed,

        },

    },

    {

        timestamps: {

            createdAt: true,

            updatedAt: false,

        },

        versionKey: false,

    }

);

AuditLogSchema.index({

    organizationId: 1,

    createdAt: -1,

});

export const AuditLogModel = mongoose.model<AuditLogDocument>(

    "AuditLog",

    AuditLogSchema

);
