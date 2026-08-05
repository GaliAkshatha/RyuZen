import { QuestionType } from "../../domain/constants/QuestionType.js";

/** The faculty-facing view - includes the real correct answers, for review/editing. See StudentAssessmentQuestionResponseDto for the student-facing view, which deliberately strips them. */
export interface AssessmentQuestionResponseDto {

    id: string;

    assessmentId: string;

    questionText: string;

    type: QuestionType;

    options: string[];

    correctOptionIndexes: number[];

    marks: number;

    order: number;

}

/** Student-facing during an attempt - deliberately never includes correctOptionIndexes. */
export interface StudentAssessmentQuestionResponseDto {

    id: string;

    questionText: string;

    type: QuestionType;

    options: string[];

    marks: number;

    order: number;

}
