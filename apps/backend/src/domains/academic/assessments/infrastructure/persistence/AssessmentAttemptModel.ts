import mongoose, { Schema, Document } from "mongoose";

export interface AssessmentAttemptDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    assessmentId: mongoose.Types.ObjectId;

    studentId: mongoose.Types.ObjectId;

    answers: {
        questionId: mongoose.Types.ObjectId;
        selectedOptionIndexes: number[];
    }[];

    score?: number;

    status: string;

    startedAt: Date;

    submittedAt?: Date;

    createdAt: Date;

}

const AssessmentAttemptSchema = new Schema<AssessmentAttemptDocument>(

    {

        organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },

        assessmentId: { type: Schema.Types.ObjectId, ref: "Assessment", required: true, index: true },

        studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },

        answers: [
            {
                questionId: { type: Schema.Types.ObjectId, ref: "AssessmentQuestion", required: true },
                selectedOptionIndexes: [{ type: Number }],
                _id: false,
            },
        ],

        score: { type: Number },

        status: {
            type: String,
            enum: ["IN_PROGRESS", "SUBMITTED", "EXPIRED"],
            default: "IN_PROGRESS",
        },

        startedAt: { type: Date, required: true },

        submittedAt: { type: Date },

    },

    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }

);

// One real attempt per student per assessment - the actual duplicate-prevention mechanism, not just an application-layer check.
AssessmentAttemptSchema.index({ assessmentId: 1, studentId: 1 }, { unique: true });

export const AssessmentAttemptModel = mongoose.model<AssessmentAttemptDocument>(
    "AssessmentAttempt",
    AssessmentAttemptSchema
);
