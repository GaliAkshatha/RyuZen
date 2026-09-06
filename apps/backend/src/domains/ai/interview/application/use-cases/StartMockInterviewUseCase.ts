import { MockInterviewSession } from "../../domain/entities/MockInterviewSession.js";

import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { IMockInterviewSessionRepository } from "../../infrastructure/repositories/IMockInterviewSessionRepository.js";

import { MockInterviewSessionResponseMapper } from "../../infrastructure/mappers/MockInterviewSessionResponseMapper.js";

import { IMockInterviewProvider } from "../ports/IMockInterviewProvider.js";

import { buildCandidateContext } from "../services/buildCandidateContext.js";

import { IPortfolioProjectRepository } from "../../../../career/portfolio/infrastructure/repositories/IPortfolioProjectRepository.js";
import { ISkillRepository } from "../../../../career/skills/infrastructure/repositories/ISkillRepository.js";

import { StartMockInterviewDto } from "../dto/StartMockInterviewDto.js";
import { MockInterviewSessionResponseDto } from "../dto/MockInterviewSessionResponseDto.js";

export class StartMockInterviewUseCase {

    constructor(

        private readonly repository: IMockInterviewSessionRepository,

        private readonly provider: IMockInterviewProvider,

        private readonly projectRepository: IPortfolioProjectRepository,

        private readonly skillRepository: ISkillRepository

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
                InterviewSessionStatus.IN_PROGRESS,

            durationMinutes:
                dto.durationMinutes

        });

        const candidateContext =

            await buildCandidateContext(

                userId,

                this.projectRepository,

                this.skillRepository

            );

        const firstQuestion =

            await this.provider.nextQuestion(

                dto.role,

                [],

                candidateContext

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
