import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

import { SubmissionResponseMapper } from "../mappers/SubmissionResponseMapper.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

export class GetSubmissionUseCase {

    constructor(

        private readonly repository: ISubmissionRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

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

        return SubmissionResponseMapper.toDto(

            submission

        );

    }

}
