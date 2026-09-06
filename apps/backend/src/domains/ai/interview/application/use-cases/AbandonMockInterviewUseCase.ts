import { IMockInterviewSessionRepository } from "../../infrastructure/repositories/IMockInterviewSessionRepository.js";

import { MockInterviewSessionResponseMapper } from "../../infrastructure/mappers/MockInterviewSessionResponseMapper.js";

import { IMockInterviewProvider } from "../ports/IMockInterviewProvider.js";

import { computeHybridScore } from "../../infrastructure/ai/interviewPrompts.js";

import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { MockInterviewSessionResponseDto } from "../dto/MockInterviewSessionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * A real, distinct action from answering - the candidate is choosing
 * to stop early, not answering a final question. Reuses the exact
 * same real hybrid scoring and AI feedback generation as a natural
 * completion, computed from whatever exchanges genuinely exist at
 * the moment of quitting - an abandoned interview still gets an
 * honest, useful review, not a blank result.
 */
export class AbandonMockInterviewUseCase {

    constructor(

        private readonly repository: IMockInterviewSessionRepository,

        private readonly provider: IMockInterviewProvider

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

        if (session.status !== InterviewSessionStatus.IN_PROGRESS) {

            throw new ApiError(

                "This interview session has already been completed.",

                HttpStatus.BAD_REQUEST

            );

        }

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

        session.abandon(

            feedback,

            finalScore

        );

        const updated =

            await this.repository.save(
                session
            );

        return MockInterviewSessionResponseMapper.toDto(

            updated

        );

    }

}
