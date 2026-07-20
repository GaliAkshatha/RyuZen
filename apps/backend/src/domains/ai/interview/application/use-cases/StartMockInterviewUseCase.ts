import { MockInterviewSession } from "../../domain/entities/MockInterviewSession.js";

import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { IMockInterviewSessionRepository } from "../../infrastructure/repositories/IMockInterviewSessionRepository.js";

import { MockInterviewSessionResponseMapper } from "../../infrastructure/mappers/MockInterviewSessionResponseMapper.js";

import { IMockInterviewProvider } from "../ports/IMockInterviewProvider.js";

import { StartMockInterviewDto } from "../dto/StartMockInterviewDto.js";
import { MockInterviewSessionResponseDto } from "../dto/MockInterviewSessionResponseDto.js";

export class StartMockInterviewUseCase {

    constructor(

        private readonly repository: IMockInterviewSessionRepository,

        private readonly provider: IMockInterviewProvider

    ) {}

    async execute(

        userId: string,

        dto: StartMockInterviewDto

    ): Promise<MockInterviewSessionResponseDto> {

        const session = MockInterviewSession.create({

            userId,

            role:
                dto.role,

            exchanges:
                [],

            status:
                InterviewSessionStatus.IN_PROGRESS

        });

        const firstQuestion =

            await this.provider.nextQuestion(

                dto.role,

                []

            );

        session.askQuestion(

            firstQuestion

        );

        const created =

            await this.repository.create(

                session

            );

        return MockInterviewSessionResponseMapper.toDto(

            created

        );

    }

}
