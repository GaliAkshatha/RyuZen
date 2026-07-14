import mongoose, { Schema, Document } from "mongoose";

export interface CertificateDocument extends Document {

    studentId: mongoose.Types.ObjectId;

    eventId?: mongoose.Types.ObjectId;

    activityId?: mongoose.Types.ObjectId;

    certificateUrl: string;

    issuedAt: Date;

}

const CertificateSchema = new Schema<CertificateDocument>(

    {

        studentId: {

            type: Schema.Types.ObjectId,

            ref: "Student",

            required: true,

            index: true,

        },

        eventId: {

            type: Schema.Types.ObjectId,

            ref: "Event",

        },

        activityId: {

            type: Schema.Types.ObjectId,

            ref: "Activity",

        },

        certificateUrl: {

            type: String,

            required: true,

            trim: true,

        },

        issuedAt: {

            type: Date,

            required: true,

        },

    },

    {

        versionKey: false,

    }

);

export const CertificateModel = mongoose.model<CertificateDocument>(

    "Certificate",

    CertificateSchema

);
