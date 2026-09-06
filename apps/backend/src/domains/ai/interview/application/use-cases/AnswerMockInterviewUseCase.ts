import { IMockInterviewSessionRepository } from "../../infrastructure/repositories/IMockInterviewSessionRepository.js";

import { MockInterviewSessionResponseMapper } from "../../infrastructure/mappers/MockInterviewSessionResponseMapper.js";

import { IMockInterviewProvider } from "../ports/IMockInterviewProvider.js";

import { buildCandidateContext } from "../services/buildCandidateContext.js";

import { computeHybridScore, MAX_QUESTIONS } from "../../infrastructure/ai/interviewPrompts.js";

import { IPortfolioProjectRepository } from "../../../../career/portfolio/infrastructure/repositories/IPortfolioProjectRepository.js";
import { ISkillRepository } from "../../../../career/skills/infrastructure/repositories/ISkillRepository.js";

import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { AnswerMockInterviewDto } from "../dto/AnswerMockInterviewDto.js";
import { MockInterviewSessionResponseDto } from "../dto/MockInterviewSessionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AnswerMockInterviewUseCase {

    constructor(

        private readonly repository: IMockInterviewSessionRepository,

        private readonly provider: IMockInterviewProvider,

        private readonly projectRepository: IPortfolioProjectRepository,

        private readonly skillRepository: ISkillRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        dto: AnswerMockInterviewDto

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

        if (session.status !== InterviewSessionStatus.IN_PROGRESS) {

            throw new ApiError(

                "This interview session has already been completed.",

                HttpStatus.BAD_REQUEST

            );

        }

        session.submitAnswer(

            dto.answer

        );

        /**
         * Real, immediate quality assessment - not deferred to the
         * end of the interview. The result drives adaptive difficulty
         * for the very next question (if any) and becomes part of the
         * real hybrid score at completion. Assessed for every answer
         * regardless of length, so a short-but-wrong answer still
         * correctly lowers difficulty rather than being invisible to
         * the adaptive system until the end.
         */
        const lastExchange =
            session.exchanges[session.exchanges.length - 1]!;

        const qualityScore =

            await this.provider.assessAnswerQuality(

                lastExchange.question,

                dto.answer

            );

        session.recordAnswerQuality(

            qualityScore

        );

        /**
         * Real backend-enforced time limit: once a real interview's
         * time is up, it ends there - the candidate doesn't get a
         * 6th question just because they were mid-answer when the
         * clock ran out. The answer they just gave is still recorded
         * and scored; only a further question is denied.
         */
        const timeIsUp =
            session.isExpired();

        if (

            session.exchanges.length >= MAX_QUESTIONS ||
            timeIsUp

        ) {

            const finalScore =

                computeHybridScore(
                    session.exchanges,
                    session.durationMinutes
                );

            const feedback =

                await this.provider.generateFeedback(

                    session.role,

                    session.exchanges,

                    finalScore

                );

            session.complete(

                feedback,

                finalScore

            );

        } else {

            const candidateContext =

                await buildCandidateContext(

                    userId,

                    this.projectRepository,

                    this.skillRepository

                );

            const nextDifficulty =

                session.nextDifficulty();

            const nextQuestion =

                await this.provider.nextQuestion(

                    session.role,

                    session.exchanges,

                    candidateContext

                );

            session.askQuestion(

                nextQuestion,

                nextDifficulty

            );

        }

        const updated =

            await this.repository.save(
                session
            );

        return MockInterviewSessionResponseMapper.toDto(

            updated

        );

    }

}
