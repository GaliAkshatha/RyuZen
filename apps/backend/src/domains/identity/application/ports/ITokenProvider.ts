import { User } from "../../domain/entities/User.js";

export interface RefreshTokenPayload {

    userId: string;

}

export interface ITokenProvider {

    generateAccessToken(
        user: User
    ): Promise<string>;

    generateRefreshToken(
        user: User
    ): Promise<string>;

    verifyRefreshToken(
        token: string
    ): Promise<RefreshTokenPayload>;

}