import mongoose, { Schema, Document } from "mongoose";

export interface InvitationDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    userId: mongoose.Types.ObjectId;

    email: string;

    role: string;

    invitedBy: mongoose.Types.ObjectId;

    tokenHash: string;

    expiresAt: Date;

    status: string;

    createdAt: Date;

    acceptedAt?: Date;

}

const InvitationSchema = new Schema<InvitationDocument>(

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
            required: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        role: {
            type: String,
            required: true,
        },

        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tokenHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"],
            default: "PENDING",
            index: true,
        },

        acceptedAt: {
            type: Date,
        },

    },

    {

        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,

    }

);

// Supports "find this org's pending invitations" (admin management UI)
// and the email+status lookup ResendInvitation/AcceptInvitation use.
InvitationSchema.index({ organizationId: 1, status: 1 });

export const InvitationModel = mongoose.model<InvitationDocument>(

    "Invitation",

    InvitationSchema

);
