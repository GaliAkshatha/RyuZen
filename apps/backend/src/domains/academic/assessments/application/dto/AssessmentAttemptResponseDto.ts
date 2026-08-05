import { AttemptStatus } from "../../domain/constants/AttemptStatus.js";

export interface AssessmentAttemptResponseDto {

    id: string;

    assessmentId: string;

    studentId: string;

    score?: number;

    status: AttemptStatus;

    startedAt: Date;

    submittedAt?: Date;

}
