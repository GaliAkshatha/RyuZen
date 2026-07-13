import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ResubmitSubmissionDto } from "../dto/ResubmitSubmissionDto.js";
import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

import { SubmissionResponseMapper } from "../mappers/SubmissionResponseMapper.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

export class ResubmitSubmissionUseCase {

    constructor(

        private readonly repository: ISubmissionRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        userId: string,

        dto: ResubmitSubmissionDto

    ): Promise<SubmissionResponseDto> {

        const submission =

            await this.repository.findById(

                id

            );

        if (

            !submission ||
            submission.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Submission not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (submission.submittedBy !== userId) {

            throw new ApiError(

                "You can only resubmit your own submission.",

                HttpStatus.FORBIDDEN

            );

        }

        if (submission.status !== SubmissionStatus.REJECTED) {

            throw new ApiError(

                "Only rejected submissions can be resubmitted.",

                HttpStatus.BAD_REQUEST

            );

        }

        submission.resubmit(

            dto.attachments,

            dto.remarks

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
