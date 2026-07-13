import { IMentorshipRepository } from "../../infrastructure/repositories/IMentorshipRepository.js";

import { MentorshipResponseMapper } from "../../infrastructure/mappers/MentorshipResponseMapper.js";

import { MentorshipResponseDto } from "../dto/MentorshipResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CancelMentorshipUseCase {

    constructor(

        private readonly repository: IMentorshipRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<MentorshipResponseDto> {

        const mentorship =

            await this.repository.findById(
                id
            );

        if (

            !mentorship ||
            mentorship.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Mentorship not found.",

                HttpStatus.NOT_FOUND

            );

        }

        mentorship.cancel();

        const updated =

            await this.repository.save(
                mentorship
            );

        return MentorshipResponseMapper.toDto(

            updated

        );

    }

}
