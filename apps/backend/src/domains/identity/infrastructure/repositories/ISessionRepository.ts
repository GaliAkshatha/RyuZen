import { Session } from "../../domain/entities/Session.js";

export interface ISessionRepository {

    create(
        session: Session
    ): Promise<Session>;

    findById(
        id: string
    ): Promise<Session | null>;

    findActiveByUserId(
        userId: string
    ): Promise<Session[]>;

    save(
        session: Session
    ): Promise<Session>;

    /** Real "logout all devices" - revokes every non-revoked session for a user in one operation. */
    revokeAllForUser(
        userId: string
    ): Promise<void>;

}
