import mongoose, { Schema, Document } from "mongoose";

export interface AttendanceSessionDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    facultyId: mongoose.Types.ObjectId;

    subject: string;

    departmentId?: mongoose.Types.ObjectId;

    qrSecret: string;

    qrRotationSeconds: number;

    windowMinutes: number;

    requireLocation: boolean;

    latitude?: number;

    longitude?: number;

    radiusMeters?: number;

    status: string;

    openedAt: Date;

    closedAt?: Date;

}

const AttendanceSessionSchema = new Schema<AttendanceSessionDocument>(

    {

        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        facultyId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "Department",
        },

        qrSecret: {
            type: String,
            required: true,
            // Never returned by default - a real secret, not display data.
            select: false,
        },

        qrRotationSeconds: {
            type: Number,
            required: true,
            default: 20,
        },

        windowMinutes: {
            type: Number,
            required: true,
            default: 15,
        },

        requireLocation: {
            type: Boolean,
            default: false,
        },

        latitude: { type: Number },

        longitude: { type: Number },

        radiusMeters: { type: Number },

        status: {
            type: String,
            enum: ["OPEN", "CLOSED"],
            default: "OPEN",
        },

        openedAt: {
            type: Date,
            required: true,
        },

        closedAt: {
            type: Date,
        },

    },

    {

        timestamps: false,
        versionKey: false,

    }

);

AttendanceSessionSchema.index({ organizationId: 1, facultyId: 1, openedAt: -1 });

export const AttendanceSessionModel = mongoose.model<AttendanceSessionDocument>(

    "AttendanceSession",

    AttendanceSessionSchema

);
