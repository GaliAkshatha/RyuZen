import { IAssessmentAttemptRepository } from "../../infrastructure/repositories/IAssessmentAttemptRepository.js";
import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";

import { AssessmentAttemptResponseMapper } from "../../infrastructure/mappers/AssessmentAttemptResponseMapper.js";
import { AssessmentAttemptResponseDto } from "../dto/AssessmentAttemptResponseDto.js";
import { RecordAssessmentAnswerDto } from "../dto/RecordAssessmentAnswerDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { AttemptStatus } from "../../domain/constants/AttemptStatus.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** A real ownership check (the attempt must belong to the requesting student) plus a real time check (an attempt past its real duration is expired on the spot, not silently accepted) - both enforced here, not just trusted from the client. */
export class RecordAssessmentAnswerUseCase {

    constructor(

        private readonly attemptRepository: IAssessmentAttemptRepository,

        private readonly assessmentRepository: IAssessmentRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        attemptId: string,

        requestingUserId: string,

        dto: RecordAssessmentAnswerDto

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

        const assessment =

            await this.assessmentRepository.findById(
                attempt.assessmentId
            );

        if (

            assessment &&
            attempt.status === AttemptStatus.IN_PROGRESS &&
            attempt.hasExceededDuration(assessment.durationMinutes)

        ) {

            attempt.expire();

            await this.attemptRepository.save(
                attempt
            );

            throw new ApiError(

                "Time is up for this attempt.",

                HttpStatus.FORBIDDEN

            );

        }

        attempt.recordAnswer(

            dto.questionId,

            dto.selectedOptionIndexes

        );

        const updated =

            await this.attemptRepository.save(
                attempt
            );

        return AssessmentAttemptResponseMapper.toDto(

            updated

        );

    }

}
