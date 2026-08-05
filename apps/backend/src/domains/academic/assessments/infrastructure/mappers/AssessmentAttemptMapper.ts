import { AssessmentAttempt } from "../../domain/entities/AssessmentAttempt.js";
import { AttemptStatus } from "../../domain/constants/AttemptStatus.js";

import { AssessmentAttemptDocument } from "../persistence/AssessmentAttemptModel.js";

export class AssessmentAttemptMapper {

    static toDomain(document: AssessmentAttemptDocument): AssessmentAttempt {

        return AssessmentAttempt.create({

            id: document.id,
            organizationId: document.organizationId.toString(),
            assessmentId: document.assessmentId.toString(),
            studentId: document.studentId.toString(),
            answers: document.answers.map(a => ({
                questionId: a.questionId.toString(),
                selectedOptionIndexes: a.selectedOptionIndexes
            })),
            score: document.score,
            status: document.status as AttemptStatus,
            startedAt: document.startedAt,
            submittedAt: document.submittedAt,
            createdAt: document.createdAt

        });

    }

    static toPersistence(attempt: AssessmentAttempt) {

        const data = attempt.toObject();

        return {
            organizationId: data.organizationId,
            assessmentId: data.assessmentId,
            studentId: data.studentId,
            answers: data.answers,
            score: data.score,
            status: data.status,
            startedAt: data.startedAt,
            submittedAt: data.submittedAt
        };

    }

}
