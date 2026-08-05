import { ISessionRepository } from "../../infrastructure/repositories/ISessionRepository.js";

/** "Logout current device" - revokes only the one session tied to the refresh token the client is currently holding. */
export class LogoutUseCase {

    constructor(

        private readonly sessionRepository: ISessionRepository

    ) {}

    async execute(

        sessionId: string

    ): Promise<void> {

        const session =

            await this.sessionRepository.findById(
                sessionId
            );

        if (!session) {

            return;

        }

        session.revoke();

        await this.sessionRepository.save(
            session
        );

    }

}
