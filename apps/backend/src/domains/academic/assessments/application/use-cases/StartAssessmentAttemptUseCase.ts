import { AssessmentAttempt } from "../../domain/entities/AssessmentAttempt.js";
import { AttemptStatus } from "../../domain/constants/AttemptStatus.js";

import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";
import { IAssessmentAttemptRepository } from "../../infrastructure/repositories/IAssessmentAttemptRepository.js";

import { AssessmentAttemptResponseMapper } from "../../infrastructure/mappers/AssessmentAttemptResponseMapper.js";
import { AssessmentAttemptResponseDto } from "../dto/AssessmentAttemptResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real eligibility: the assessment must genuinely be open right now
 * (Assessment.isOpenForAttempts - status + real start/end window), and
 * if it's department-restricted, the real student's real department
 * must match. If an IN_PROGRESS attempt already exists and hasn't
 * exceeded the real duration, it's resumed rather than blocked or
 * duplicated - a real student losing network mid-attempt shouldn't
 * lose their progress. One real attempt per student per assessment is
 * enforced by the database's own unique index, not just this check.
 */
export class StartAssessmentAttemptUseCase {

    constructor(

        private readonly assessmentRepository: IAssessmentRepository,

        private readonly attemptRepository: IAssessmentAttemptRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        assessmentId: string,

        organizationId: string,

        requestingUserId: string

    ): Promise<AssessmentAttemptResponseDto> {

        const assessment =

            await this.assessmentRepository.findById(
                assessmentId
            );

        if (

            !assessment ||
            assessment.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Assessment not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const student =

            await this.studentRepository.findByUserId(
                requestingUserId
            );

        if (!student) {

            throw new ApiError(

                "Only a student can attempt an assessment.",

                HttpStatus.FORBIDDEN

            );

        }

        if (

            assessment.departmentId &&
            student.departmentId !== assessment.departmentId

        ) {

            throw new ApiError(

                "This assessment is not open to your department.",

                HttpStatus.FORBIDDEN

            );

        }

        const existing =

            await this.attemptRepository.findByAssessmentAndStudent(
                assessmentId,
                student.id!
            );

        if (existing) {

            const stillGoing =

                existing.status === AttemptStatus.IN_PROGRESS &&
                !existing.hasExceededDuration(assessment.durationMinutes);

            if (stillGoing) {

                return AssessmentAttemptResponseMapper.toDto(
                    existing
                );

            }

            if (existing.status === AttemptStatus.IN_PROGRESS) {

                existing.expire();

                await this.attemptRepository.save(
                    existing
                );

            }

            throw new ApiError(

                "You have already attempted this assessment.",

                HttpStatus.CONFLICT

            );

        }

        if (!assessment.isOpenForAttempts()) {

            throw new ApiError(

                "This assessment is not currently open.",

                HttpStatus.FORBIDDEN

            );

        }

        const attempt = AssessmentAttempt.create({

            organizationId,

            assessmentId,

            studentId: student.id!,

            answers: [],

            status: AttemptStatus.IN_PROGRESS,

            startedAt: new Date()

        });

        const created =

            await this.attemptRepository.create(
                attempt
            );

        return AssessmentAttemptResponseMapper.toDto(

            created

        );

    }

}
