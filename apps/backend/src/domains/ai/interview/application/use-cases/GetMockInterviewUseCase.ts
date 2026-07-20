import { IMockInterviewSessionRepository } from "../../infrastructure/repositories/IMockInterviewSessionRepository.js";

import { MockInterviewSessionResponseMapper } from "../../infrastructure/mappers/MockInterviewSessionResponseMapper.js";

import { MockInterviewSessionResponseDto } from "../dto/MockInterviewSessionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMockInterviewUseCase {

    constructor(

        private readonly repository: IMockInterviewSessionRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<MockInterviewSessionResponseDto> {

        const session =

            await this.repository.findById(
                id
            );

        if (

            !session ||
            session.userId !== userId

        ) {

            throw new ApiError(

                "Mock interview session not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return MockInterviewSessionResponseMapper.toDto(

            session

        );

    }

}
