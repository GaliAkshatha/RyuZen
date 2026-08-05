import mongoose, { Schema, Document } from "mongoose";

export interface AttendanceRecordDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    sessionId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    method: string;

    status: string;

    markedAt: Date;

    ipAddress?: string;

    userAgent?: string;

    latitude?: number;

    longitude?: number;

    markedBy?: mongoose.Types.ObjectId;

    correctionStatus?: string;

    correctionReason?: string;

    correctionReviewedBy?: mongoose.Types.ObjectId;

}

const AttendanceRecordSchema = new Schema<AttendanceRecordDocument>(

    {

        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        sessionId: {
            type: Schema.Types.ObjectId,
            ref: "AttendanceSession",
            required: true,
            index: true,
        },

        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            index: true,
        },

        method: {
            type: String,
            enum: ["QR", "MANUAL", "OFFLINE"],
            required: true,
        },

        status: {
            type: String,
            enum: ["PRESENT", "LATE", "ABSENT", "EXCUSED"],
            required: true,
        },

        markedAt: {
            type: Date,
            required: true,
        },

        ipAddress: { type: String },

        userAgent: { type: String },

        latitude: { type: Number },

        longitude: { type: Number },

        markedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        correctionStatus: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
        },

        correctionReason: { type: String },

        correctionReviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

    },

    {

        timestamps: false,
        versionKey: false,

    }

);

// Real duplicate prevention - one record per (session, student), enforced at the database level, not just application-layer.
AttendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

// Real anomaly-detection surface - same IP marking many different students in one session.
AttendanceRecordSchema.index({ sessionId: 1, ipAddress: 1 });

export const AttendanceRecordModel = mongoose.model<AttendanceRecordDocument>(

    "AttendanceRecord",

    AttendanceRecordSchema

);
