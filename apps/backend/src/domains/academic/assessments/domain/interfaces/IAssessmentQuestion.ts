import { QuestionType } from "../constants/QuestionType.js";

export interface IAssessmentQuestion {

    id?: string;

    assessmentId: string;

    questionText: string;

    type: QuestionType;

    /** Real option text, indexed 0..n-1 - correctOptionIndexes below refers to these same indexes. */
    options: string[];

    /** Which option index(es) are correct - a single-element array for MCQ_SINGLE/TRUE_FALSE, multiple for MCQ_MULTIPLE. Never exposed to students before/during their attempt (see AssessmentQuestionResponseMapper - a student-facing view strips this entirely). */
    correctOptionIndexes: number[];

    marks: number;

    order: number;

    createdAt?: Date;

}
