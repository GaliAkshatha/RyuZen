import { AssessmentAttempt } from "../../domain/entities/AssessmentAttempt.js";

import { AssessmentAttemptResponseDto } from "../../application/dto/AssessmentAttemptResponseDto.js";

export class AssessmentAttemptResponseMapper {

    static toDto(attempt: AssessmentAttempt): AssessmentAttemptResponseDto {

        return {
            id: attempt.id!,
            assessmentId: attempt.assessmentId,
            studentId: attempt.studentId,
            score: attempt.score,
            status: attempt.status,
            startedAt: attempt.startedAt,
            submittedAt: attempt.submittedAt
        };

    }

}
