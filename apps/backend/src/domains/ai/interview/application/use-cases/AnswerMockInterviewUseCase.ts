import { IMockInterviewSessionRepository } from "../../infrastructure/repositories/IMockInterviewSessionRepository.js";

import { MockInterviewSessionResponseMapper } from "../../infrastructure/mappers/MockInterviewSessionResponseMapper.js";

import { IMockInterviewProvider } from "../ports/IMockInterviewProvider.js";

import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { AnswerMockInterviewDto } from "../dto/AnswerMockInterviewDto.js";
import { MockInterviewSessionResponseDto } from "../dto/MockInterviewSessionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

const MAX_QUESTIONS = 5;

export class AnswerMockInterviewUseCase {

    constructor(

        private readonly repository: IMockInterviewSessionRepository,

        private readonly provider: IMockInterviewProvider

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

        if (session.exchanges.length >= MAX_QUESTIONS) {

            const result =

                await this.provider.generateFeedback(

                    session.role,

                    session.exchanges

                );

            session.complete(

                result.feedback,

                result.score

            );

        } else {

            const nextQuestion =

                await this.provider.nextQuestion(

                    session.role,

                    session.exchanges

                );

            session.askQuestion(

                nextQuestion

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
