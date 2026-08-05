import { Session } from "../../domain/entities/Session.js";

import { SessionModel } from "../persistence/SessionModel.js";

import { SessionMapper } from "../mappers/SessionMapper.js";

import { ISessionRepository } from "./ISessionRepository.js";

export class SessionRepository
implements ISessionRepository {

    async create(

        session: Session

    ): Promise<Session> {

        const document =
            await SessionModel.create(

                SessionMapper.toPersistence(
                    session
                )

            );

        return SessionMapper.toDomain(
            document
        );

    }

    async findById(

        id: string

    ): Promise<Session | null> {

        const document =
            await SessionModel.findById(id);

        return document
            ? SessionMapper.toDomain(document)
            : null;

    }

    async findActiveByUserId(

        userId: string

    ): Promise<Session[]> {

        const documents =
            await SessionModel
                .find({ userId, revoked: false })
                .sort({ lastActiveAt: -1 });

        return documents.map(
            document => SessionMapper.toDomain(document)
        );

    }

    async save(

        session: Session

    ): Promise<Session> {

        const document =
            await SessionModel.findByIdAndUpdate(

                session.id,

                SessionMapper.toPersistence(
                    session
                ),

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!document) {

            throw new Error(
                "Session not found."
            );

        }

        return SessionMapper.toDomain(
            document
        );

    }

    async revokeAllForUser(

        userId: string

    ): Promise<void> {

        await SessionModel.updateMany(

            { userId, revoked: false },

            { $set: { revoked: true } }

        );

    }

}
