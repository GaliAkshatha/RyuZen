import { ISessionRepository } from "../../infrastructure/repositories/ISessionRepository.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

/** "Revoke individual sessions" - logging out one specific device from the session list, without affecting any other active session. */
export class RevokeSessionUseCase {

    constructor(

        private readonly sessionRepository: ISessionRepository

    ) {}

    async execute(

        sessionId: string,

        userId: string

    ): Promise<void> {

        const session =

            await this.sessionRepository.findById(
                sessionId
            );

        if (!session || session.userId !== userId) {

            throw new ApiError(

                "Session not found.",

                HttpStatus.NOT_FOUND

            );

        }

        session.revoke();

        await this.sessionRepository.save(
            session
        );

    }

}
