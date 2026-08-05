import mongoose, { Schema, Document } from "mongoose";

export interface SessionDocument extends Document {

    userId: mongoose.Types.ObjectId;

    organizationId: mongoose.Types.ObjectId;

    device: string;

    browser: string;

    ipAddress: string;

    userAgent: string;

    refreshTokenHash: string;

    createdAt: Date;

    lastActiveAt: Date;

    expiresAt: Date;

    revoked: boolean;

}

const SessionSchema = new Schema<SessionDocument>(

    {

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        device: {
            type: String,
            required: true,
        },

        browser: {
            type: String,
            required: true,
        },

        ipAddress: {
            type: String,
            required: true,
        },

        userAgent: {
            type: String,
            required: true,
        },

        refreshTokenHash: {
            type: String,
            required: false,
            default: "",
            // Deliberately NOT required: LoginUserUseCase creates the
            // session with an empty placeholder here (it needs the
            // session's real id before it can generate + hash the
            // refresh token that embeds that id), then immediately
            // calls session.rotate() and saves again with the real
            // hash. Making this field required rejects that first
            // write outright - confirmed as the actual cause of every
            // login failing with "Session validation failed:
            // refreshTokenHash: Path `refreshTokenHash` is required."
            // Do not reinstate `required: true` without also removing
            // the two-write pattern in LoginUserUseCase.
        },

        lastActiveAt: {
            type: Date,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        revoked: {
            type: Boolean,
            default: false,
        },

    },

    {

        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,

    }

);

SessionSchema.index({ userId: 1, revoked: 1 });

export const SessionModel = mongoose.model<SessionDocument>(

    "Session",

    SessionSchema

);
