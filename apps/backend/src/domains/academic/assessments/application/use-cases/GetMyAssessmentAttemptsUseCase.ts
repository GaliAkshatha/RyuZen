import { IAssessmentAttemptRepository } from "../../infrastructure/repositories/IAssessmentAttemptRepository.js";

import { AssessmentAttemptResponseMapper } from "../../infrastructure/mappers/AssessmentAttemptResponseMapper.js";
import { AssessmentAttemptResponseDto } from "../dto/AssessmentAttemptResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** A student's own real attempt history - resolved from their own real profile, never a studentId a caller could substitute. */
export class GetMyAssessmentAttemptsUseCase {

    constructor(

        private readonly attemptRepository: IAssessmentAttemptRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        requestingUserId: string

    ): Promise<AssessmentAttemptResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                requestingUserId
            );

        if (!student) {

            throw new ApiError(

                "No student profile found for this account.",

                HttpStatus.FORBIDDEN

            );

        }

        const attempts =

            await this.attemptRepository.findByStudent(
                student.id!
            );

        return attempts.map(

            attempt => AssessmentAttemptResponseMapper.toDto(attempt)

        );

    }

}
