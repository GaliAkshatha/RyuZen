import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ReviewSubmissionDto } from "../dto/ReviewSubmissionDto.js";
import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

import { SubmissionResponseMapper } from "../mappers/SubmissionResponseMapper.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

export class ReviewSubmissionUseCase {

    constructor(

        private readonly repository: ISubmissionRepository

    ) {}

    async execute(

        submissionId: string,

        reviewerId: string,

        dto: ReviewSubmissionDto

    ): Promise<SubmissionResponseDto> {

        const submission =

            await this.repository.findById(

                submissionId

            );

        if (!submission) {

            throw new ApiError(

                "Submission not found.",

                HttpStatus.NOT_FOUND

            );

        }

        submission.applyreview(

            reviewerId,

            dto.status === SubmissionStatus.APPROVED,

            dto.feedback,

            dto.pointsAwarded

        );

        const updated =

            await this.repository.save(

                submission

            );

        return SubmissionResponseMapper.toDto(

            updated

        );

    }

}