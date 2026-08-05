import { Session } from "../../domain/entities/Session.js";

import { SessionResponseDto } from "../../application/dto/SessionResponseDto.js";

export class SessionResponseMapper {

    static toDto(

        session: Session,

        currentSessionId?: string

    ): SessionResponseDto {

        return {

            id:
                session.id!,

            device:
                session.device,

            browser:
                session.browser,

            ipAddress:
                session.ipAddress,

            createdAt:
                session.createdAt,

            lastActiveAt:
                session.lastActiveAt,

            isCurrent:
                session.id === currentSessionId

        };

    }

}
