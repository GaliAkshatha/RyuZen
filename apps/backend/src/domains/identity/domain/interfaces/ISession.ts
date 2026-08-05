export interface ISession {

    id?: string;

    userId: string;

    organizationId: string;

    /** Best-effort parsed from the real User-Agent header - see parseUserAgent.ts. Never fabricated when unavailable; falls back to "Unknown". */
    device: string;

    browser: string;

    ipAddress: string;

    userAgent: string;

    /** Hash of the CURRENT valid refresh token for this session - updated on every rotation, never the raw token. */
    refreshTokenHash: string;

    createdAt?: Date;

    lastActiveAt: Date;

    expiresAt: Date;

    revoked: boolean;

}
