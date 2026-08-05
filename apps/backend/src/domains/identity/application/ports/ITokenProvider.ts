import { User } from "../../domain/entities/User.js";

export interface RefreshTokenPayload {

    userId: string;

    sessionId: string;

}

export interface ITokenProvider {

    generateAccessToken(
        user: User,
        sessionId?: string
    ): Promise<string>;

    /** sessionId is embedded in the token so RefreshTokenUseCase can look up the exact Session record on refresh - real rotation and reuse detection both depend on this. */
    generateRefreshToken(
        user: User,
        sessionId: string
    ): Promise<string>;

    verifyRefreshToken(
        token: string
    ): Promise<RefreshTokenPayload>;

}