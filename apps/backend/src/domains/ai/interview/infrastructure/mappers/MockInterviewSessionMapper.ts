import { MockInterviewSession } from "../../domain/entities/MockInterviewSession.js";

import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { InterviewDifficulty } from "../../domain/interfaces/IInterviewExchange.js";

import {
    MockInterviewSessionDocument
} from "../persistence/MockInterviewSessionModel.js";

export class MockInterviewSessionMapper {

    static toDomain(

        document: MockInterviewSessionDocument

    ): MockInterviewSession {

        return MockInterviewSession.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            role:
                document.role,

            exchanges:
                document.exchanges.map(

                    exchange => ({

                        question:
                            exchange.question,

                        difficulty:
                            exchange.difficulty as InterviewDifficulty,

                        qualityScore:
                            exchange.qualityScore,

                        answer:
                            exchange.answer,

                        askedAt:
                            exchange.askedAt,

                        answeredAt:
                            exchange.answeredAt

                    })

                ),

            status:
                document.status as InterviewSessionStatus,

            durationMinutes:
                document.durationMinutes,

            feedback:
                document.feedback,

            strengths:
                document.strengths,

            improvements:
                document.improvements,

            score:
                document.score,

            createdAt:
                document.createdAt

        });

    }

    static toPersistence(

        session: MockInterviewSession

    ) {

        const data =
            session.toObject();

        return {

            userId:
                data.userId,

            role:
                data.role,

            exchanges:
                data.exchanges,

            status:
                data.status,

            durationMinutes:
                data.durationMinutes,

            feedback:
                data.feedback,

            strengths:
                data.strengths,

            improvements:
                data.improvements,

            score:
                data.score

        };

    }

}
