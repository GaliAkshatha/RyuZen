import mongoose, { Schema, Document } from "mongoose";

export interface ConnectionRequestDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    fromUserId: mongoose.Types.ObjectId;

    toUserId: mongoose.Types.ObjectId;

    status: string;

    respondedAt?: Date;

    createdAt: Date;

}

const ConnectionRequestSchema = new Schema<ConnectionRequestDocument>(

    {

        organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },

        fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING",
        },

        respondedAt: { type: Date },

    },

    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }

);

// One real request per direction per pair - re-sending after a real
// rejection is allowed (a new document), but never two simultaneously
// PENDING requests between the same two real people in the same
// direction. Real duplicate-prevention is enforced in
// SendConnectionRequestUseCase by checking both directions for any
// existing PENDING/ACCEPTED record, not by this index alone (which
// only prevents the exact same pair from having two rows outright).
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
ConnectionRequestSchema.index({ toUserId: 1, status: 1 });

export const ConnectionRequestModel = mongoose.model<ConnectionRequestDocument>(
    "ConnectionRequest",
    ConnectionRequestSchema
);
