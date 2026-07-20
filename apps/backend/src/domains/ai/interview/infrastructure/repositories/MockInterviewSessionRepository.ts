import { MockInterviewSession } from "../../domain/entities/MockInterviewSession.js";

import { MockInterviewSessionModel } from "../persistence/MockInterviewSessionModel.js";

import { MockInterviewSessionMapper } from "../mappers/MockInterviewSessionMapper.js";

import { IMockInterviewSessionRepository } from "./IMockInterviewSessionRepository.js";

export class MockInterviewSessionRepository
implements IMockInterviewSessionRepository {

    async create(

        session: MockInterviewSession

    ): Promise<MockInterviewSession> {

        const document =

            await MockInterviewSessionModel.create(

                MockInterviewSessionMapper.toPersistence(

                    session

                )

            );

        return MockInterviewSessionMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<MockInterviewSession | null> {

        const document =

            await MockInterviewSessionModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return MockInterviewSessionMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<MockInterviewSession[]> {

        const documents =

            await MockInterviewSessionModel.find({

                userId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                MockInterviewSessionMapper.toDomain(
                    document
                )

        );

    }

    async save(

        session: MockInterviewSession

    ): Promise<MockInterviewSession> {

        const document =

            await MockInterviewSessionModel.findByIdAndUpdate(

                session.id,

                MockInterviewSessionMapper.toPersistence(

                    session

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Mock interview session not found."

            );

        }

        return MockInterviewSessionMapper.toDomain(

            document

        );

    }

}
