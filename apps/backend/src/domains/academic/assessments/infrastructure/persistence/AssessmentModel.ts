import mongoose, { Schema, Document } from "mongoose";

export interface AssessmentDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    title: string;

    description?: string;

    type: string;

    createdBy: mongoose.Types.ObjectId;

    departmentId?: mongoose.Types.ObjectId;

    durationMinutes: number;

    totalMarks: number;

    passingScore?: number;

    status: string;

    startsAt?: Date;

    endsAt?: Date;

    createdAt: Date;

    updatedAt: Date;

}

const AssessmentSchema = new Schema<AssessmentDocument>(

    {

        organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },

        title: { type: String, required: true, trim: true },

        description: { type: String, trim: true },

        type: {
            type: String,
            enum: ["APTITUDE", "BRANCH_SPECIFIC", "WEEKLY", "COMPANY_SPECIFIC"],
            required: true,
        },

        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

        departmentId: { type: Schema.Types.ObjectId, ref: "Department" },

        durationMinutes: { type: Number, required: true },

        totalMarks: { type: Number, required: true, default: 0 },

        passingScore: { type: Number },

        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED", "CLOSED"],
            default: "DRAFT",
            index: true,
        },

        startsAt: { type: Date },

        endsAt: { type: Date },

    },

    { timestamps: true, versionKey: false }

);

AssessmentSchema.index({ organizationId: 1, status: 1 });

export const AssessmentModel = mongoose.model<AssessmentDocument>("Assessment", AssessmentSchema);
