import { ISession } from "../interfaces/ISession.js";

export class Session {

    constructor(

        private readonly props: ISession

    ) {}

    static create(

        props: ISession

    ): Session {

        return new Session(props);

    }

    /** Rotation: a new refresh token was issued for this session - the old token's hash is discarded, so replaying it is now detectable as reuse. */
    rotate(

        newRefreshTokenHash: string,

        newExpiresAt: Date

    ): void {

        this.props.refreshTokenHash = newRefreshTokenHash;

        this.props.expiresAt = newExpiresAt;

        this.props.lastActiveAt = new Date();

    }

    revoke(): void {

        this.props.revoked = true;

    }

    isExpired(): boolean {

        return this.props.expiresAt.getTime() < Date.now();

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get device(): string {
        return this.props.device;
    }

    get browser(): string {
        return this.props.browser;
    }

    get ipAddress(): string {
        return this.props.ipAddress;
    }

    get userAgent(): string {
        return this.props.userAgent;
    }

    get refreshTokenHash(): string {
        return this.props.refreshTokenHash;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get lastActiveAt(): Date {
        return this.props.lastActiveAt;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get revoked(): boolean {
        return this.props.revoked;
    }

    toObject(): Readonly<ISession> {
        return Object.freeze({ ...this.props });
    }

}
