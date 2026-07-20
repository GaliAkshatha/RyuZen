import { IMockInterviewSessionRepository } from "../../infrastructure/repositories/IMockInterviewSessionRepository.js";

import { MockInterviewSessionResponseMapper } from "../../infrastructure/mappers/MockInterviewSessionResponseMapper.js";

import { MockInterviewSessionResponseDto } from "../dto/MockInterviewSessionResponseDto.js";

export class GetMyMockInterviewsUseCase {

    constructor(

        private readonly repository: IMockInterviewSessionRepository

    ) {}

    async execute(

        userId: string

    ): Promise<MockInterviewSessionResponseDto[]> {

        const sessions =

            await this.repository.findByUserId(
                userId
            );

        return sessions.map(

            session =>

                MockInterviewSessionResponseMapper.toDto(
                    session
                )

        );

    }

}
