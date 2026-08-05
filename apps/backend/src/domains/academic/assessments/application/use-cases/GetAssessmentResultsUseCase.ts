import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";
import { IAssessmentAttemptRepository } from "../../infrastructure/repositories/IAssessmentAttemptRepository.js";

import { AssessmentAttemptResponseMapper } from "../../infrastructure/mappers/AssessmentAttemptResponseMapper.js";
import { AssessmentAttemptResponseDto } from "../dto/AssessmentAttemptResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** Faculty-facing - every real attempt (in-progress, submitted, expired) for one real assessment, org-scoped. */
export class GetAssessmentResultsUseCase {

    constructor(

        private readonly assessmentRepository: IAssessmentRepository,

        private readonly attemptRepository: IAssessmentAttemptRepository

    ) {}

    async execute(

        assessmentId: string,

        organizationId: string

    ): Promise<AssessmentAttemptResponseDto[]> {

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

        const attempts =

            await this.attemptRepository.findByAssessment(
                assessmentId
            );

        return attempts.map(

            attempt => AssessmentAttemptResponseMapper.toDto(attempt)

        );

    }

}
