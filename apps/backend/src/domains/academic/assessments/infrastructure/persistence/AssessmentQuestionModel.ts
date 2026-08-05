import mongoose, { Schema, Document } from "mongoose";

export interface AssessmentQuestionDocument extends Document {

    assessmentId: mongoose.Types.ObjectId;

    questionText: string;

    type: string;

    options: string[];

    correctOptionIndexes: number[];

    marks: number;

    order: number;

    createdAt: Date;

}

const AssessmentQuestionSchema = new Schema<AssessmentQuestionDocument>(

    {

        assessmentId: { type: Schema.Types.ObjectId, ref: "Assessment", required: true, index: true },

        questionText: { type: String, required: true, trim: true },

        type: {
            type: String,
            enum: ["MCQ_SINGLE", "MCQ_MULTIPLE", "TRUE_FALSE"],
            required: true,
        },

        options: [{ type: String }],

        correctOptionIndexes: [{ type: Number }],

        marks: { type: Number, required: true },

        order: { type: Number, required: true },

    },

    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }

);

AssessmentQuestionSchema.index({ assessmentId: 1, order: 1 });

export const AssessmentQuestionModel = mongoose.model<AssessmentQuestionDocument>(
    "AssessmentQuestion",
    AssessmentQuestionSchema
);
