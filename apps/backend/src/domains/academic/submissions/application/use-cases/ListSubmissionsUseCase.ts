import { SubmissionFilter } from "../dto/SubmissionFilter.js";
import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

import { SubmissionResponseMapper } from "../mappers/SubmissionResponseMapper.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

export class ListSubmissionsUseCase {

    constructor(

        private readonly repository: ISubmissionRepository

    ) {}

    async execute(

        filter: SubmissionFilter

    ): Promise<SubmissionResponseDto[]> {

        const submissions =

            await this.repository.findAll(

                filter

            );

        return submissions.map(

            submission =>

                SubmissionResponseMapper.toDto(
                    submission
                )

        );

    }

}
