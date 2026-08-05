import { ISessionRepository } from "../../infrastructure/repositories/ISessionRepository.js";

import { SessionResponseMapper } from "../../infrastructure/mappers/SessionResponseMapper.js";
import { SessionResponseDto } from "../dto/SessionResponseDto.js";

export class GetMySessionsUseCase {

    constructor(

        private readonly sessionRepository: ISessionRepository

    ) {}

    async execute(

        userId: string,

        currentSessionId: string

    ): Promise<SessionResponseDto[]> {

        const sessions =

            await this.sessionRepository.findActiveByUserId(
                userId
            );

        return sessions.map(

            session => SessionResponseMapper.toDto(session, currentSessionId)

        );

    }

}
