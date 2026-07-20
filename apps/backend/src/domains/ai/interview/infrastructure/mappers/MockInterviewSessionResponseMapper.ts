import { MockInterviewSession } from "../../domain/entities/MockInterviewSession.js";

import { MockInterviewSessionResponseDto } from "../../application/dto/MockInterviewSessionResponseDto.js";

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

                        answer:
                            exchange.answer,

                        askedAt:
                            exchange.askedAt,

                        answeredAt:
                            exchange.answeredAt

                    })

                ),

            status:
                session.status,

            feedback:
                session.feedback,

            score:
                session.score,

            createdAt:
                session.createdAt

        };

    }

}
