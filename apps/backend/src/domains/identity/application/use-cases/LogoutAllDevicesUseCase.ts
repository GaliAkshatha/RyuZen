import { ISessionRepository } from "../../infrastructure/repositories/ISessionRepository.js";

/** "Logout all devices" - revokes every active session for the user in one operation, not just the current one. */
export class LogoutAllDevicesUseCase {

    constructor(

        private readonly sessionRepository: ISessionRepository

    ) {}

    async execute(

        userId: string

    ): Promise<void> {

        await this.sessionRepository.revokeAllForUser(
            userId
        );

    }

}
