import { AttemptStatus } from "../constants/AttemptStatus.js";

export interface IAssessmentAnswer {

    questionId: string;

    selectedOptionIndexes: number[];

}

export interface IAssessmentAttempt {

    id?: string;

    organizationId: string;

    assessmentId: string;

    studentId: string;

    answers: IAssessmentAnswer[];

    /** Real, computed at grading time from the actual questions' correctOptionIndexes - never entered manually for MCQ/objective questions. */
    score?: number;

    status: AttemptStatus;

    startedAt: Date;

    submittedAt?: Date;

    createdAt?: Date;

}
