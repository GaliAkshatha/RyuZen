import { MockInterviewSession } from "../../domain/entities/MockInterviewSession.js";

import { MockInterviewSessionResponseDto } from "../../application/dto/MockInterviewSessionResponseDto.js";

import { MAX_QUESTIONS } from "../ai/interviewPrompts.js";

export class MockInterviewSessionResponseMapper {

    static toDto(

        session: MockInterviewSession

    ): MockInterviewSessionResponseDto {

        return {

            id:
                session.id!,

            userId:
                session.userId,

            role:
                session.role,

            exchanges:
                session.exchanges.map(

                    exchange => ({

                        question:
                            exchange.question,

                        difficulty:
                            exchange.difficulty,

                        answer:
                            exchange.answer,

                        qualityScore:
                            exchange.qualityScore,

                        askedAt:
                            exchange.askedAt,

                        answeredAt:
                            exchange.answeredAt

                    })

                ),

            status:
                session.status,

            durationMinutes:
                session.durationMinutes,

            perQuestionSeconds:
                Math.floor((session.durationMinutes * 60) / MAX_QUESTIONS),

            feedback:
                session.feedback,

            strengths:
                session.strengths,

            improvements:
                session.improvements,

            score:
                session.score,

            createdAt:
                session.createdAt

        };

    }

}
