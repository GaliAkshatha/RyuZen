import { IAssessmentAttemptRepository } from "../../infrastructure/repositories/IAssessmentAttemptRepository.js";
import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";
import { IAssessmentQuestionRepository } from "../../infrastructure/repositories/IAssessmentQuestionRepository.js";

import { AssessmentAttemptResponseMapper } from "../../infrastructure/mappers/AssessmentAttemptResponseMapper.js";
import { AssessmentAttemptResponseDto } from "../dto/AssessmentAttemptResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { AttemptStatus } from "../../domain/constants/AttemptStatus.js";

import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * The real, only place scoring happens. Grades against the REAL
 * questions fetched fresh from the database - never trusts a
 * client-submitted score, and never re-uses whatever the client
 * thinks the questions were. For every question, AssessmentQuestion's
 * own isAnsweredCorrectly() does the real, deterministic comparison -
 * if the student never answered a question at all, it's treated as
 * genuinely wrong (0 marks), not skipped/ignored.
 *
 * A real time check happens here too: an attempt past its duration is
 * expired on submit, not scored, even if the client tries to submit
 * anyway - this is the actual enforcement point, not just a UI timer.
 *
 * A real growth event fires only when the student genuinely passes
 * (score >= assessment.passingScore, when one is set) - never for a
 * submission alone, matching the same "only verified positive
 * milestones count" discipline used everywhere else.
 */
export class SubmitAssessmentAttemptUseCase {

    constructor(

        private readonly attemptRepository: IAssessmentAttemptRepository,

        private readonly assessmentRepository: IAssessmentRepository,

        private readonly questionRepository: IAssessmentQuestionRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase

    ) {}

    async execute(

        attemptId: string,

        requestingUserId: string

    ): Promise<AssessmentAttemptResponseDto> {

        const attempt =

            await this.attemptRepository.findById(
                attemptId
            );

        if (!attempt) {

            throw new ApiError(

                "Attempt not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const student =

            await this.studentRepository.findByUserId(
                requestingUserId
            );

        if (

            !student ||
            attempt.studentId !== student.id

        ) {

            throw new ApiError(

                "Attempt not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (attempt.status !== AttemptStatus.IN_PROGRESS) {

            throw new ApiError(

                "This attempt has already been submitted or has expired.",

                HttpStatus.BAD_REQUEST

            );

        }

        const assessment =

            await this.assessmentRepository.findById(
                attempt.assessmentId
            );

        if (!assessment) {

            throw new ApiError(

                "The assessment for this attempt no longer exists.",

                HttpStatus.NOT_FOUND

            );

        }

        if (attempt.hasExceededDuration(assessment.durationMinutes)) {

            attempt.expire();

            await this.attemptRepository.save(
                attempt
            );

            throw new ApiError(

                "Time is up for this attempt - it has been marked expired, not submitted.",

                HttpStatus.FORBIDDEN

            );

        }

        const questions =

            await this.questionRepository.findByAssessment(
                attempt.assessmentId
            );

        let score = 0;

        for (const question of questions) {

            const answer =

                attempt.answers.find(a => a.questionId === question.id);

            const selected =
                answer?.selectedOptionIndexes ?? [];

            if (question.isAnsweredCorrectly(selected)) {

                score += question.marks;

            }

        }

        attempt.submit(
            score
        );

        const updated =

            await this.attemptRepository.save(
                attempt
            );

        if (

            assessment.passingScore !== undefined &&
            score >= assessment.passingScore

        ) {

            await this.recordGrowthEvent.execute({

                organizationId: attempt.organizationId,

                studentId: student.id!,

                domain: "academic",

                eventType: "ASSESSMENT_PASSED",

                evidence: { entityType: "AssessmentAttempt", entityId: updated.id! },

                verifiedBy: "system",

                contributionWeight: score

            }).catch(() => {
                // Growth Profile recording must never break a real, already-graded submission.
            });

        }

        return AssessmentAttemptResponseMapper.toDto(

            updated

        );

    }

}
