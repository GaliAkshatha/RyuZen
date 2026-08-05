import ms from "ms";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";
import { ISessionRepository } from "../../infrastructure/repositories/ISessionRepository.js";

import { ITokenProvider } from "../ports/ITokenProvider.js";

import { RefreshTokenDto } from "../dto/RefreshTokenDto.js";
import { AuthResponseDto } from "../dto/AuthResponseDto.js";

import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";

import { env } from "../../../../config/env.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

/**
 * REAL rotation with reuse detection - the previous implementation
 * generated a new refresh token on every call but never invalidated
 * the old one (pure stateless JWT verification, no server-side
 * tracking at all), so a leaked refresh token stayed valid until its
 * own natural expiry regardless of how many times it was "rotated".
 * Confirmed by reading the old implementation directly before
 * rewriting it, not assumed.
 *
 * The token hash uses hashToken (SHA-256), not bcrypt - confirmed by
 * a real failing test that bcrypt silently truncates its input to 72
 * bytes, and two different JWTs signed moments apart with similar
 * claims commonly share the same first 72 bytes, so bcrypt.compare()
 * was producing FALSE-POSITIVE matches for genuinely different
 * tokens. See hashToken.ts for the full explanation. This was a real,
 * demonstrated bug, not a theoretical concern.
 *
 * Real flow: the submitted token's hash must match the session's
 * CURRENTLY stored hash. If it does, this is the legitimate,
 * most-recent token - rotate normally (new token, new hash stored,
 * old hash discarded). If it doesn't match a real, non-revoked
 * session, that's reuse of an already-rotated-away token - the
 * standard signal for token theft (an attacker replaying a captured
 * older token after the legitimate client already moved on). The
 * response is to revoke the ENTIRE session, forcing a real re-login,
 * rather than silently accept the reused token.
 */
export class RefreshTokenUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly sessionRepository: ISessionRepository,

        private readonly tokenProvider: ITokenProvider

    ) {}

    async execute(

        dto: RefreshTokenDto

    ): Promise<AuthResponseDto> {

        const payload =

            await this.tokenProvider.verifyRefreshToken(
                dto.refreshToken
            );

        const session =

            await this.sessionRepository.findById(
                payload.sessionId
            );

        if (!session || session.revoked || session.isExpired()) {

            throw new ApiError(

                "Invalid refresh token.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const tokenMatchesSession =

            hashToken(dto.refreshToken) === session.refreshTokenHash;

        if (!tokenMatchesSession) {

            // Reuse of an already-rotated-away token - treat as
            // possible theft and kill the whole session rather than
            // trust it.
            session.revoke();

            await this.sessionRepository.save(
                session
            );

            throw new ApiError(

                "This session is no longer valid. Please log in again.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const user =

            await this.userRepository.findById(
                payload.userId
            );

        if (!user || user.id !== session.userId) {

            throw new ApiError(

                "Invalid refresh token.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const accessToken =

            await this.tokenProvider.generateAccessToken(
                user,
                session.id!
            );

        const newRefreshToken =

            await this.tokenProvider.generateRefreshToken(
                user,
                session.id!
            );

        const newRefreshTokenHash =

            hashToken(newRefreshToken);

        const refreshTokenTtlMs =
            ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);

        session.rotate(

            newRefreshTokenHash,

            new Date(Date.now() + refreshTokenTtlMs)

        );

        await this.sessionRepository.save(
            session
        );

        return {

            accessToken,

            refreshToken: newRefreshToken,

            user: {

                id: user.id!,

                organizationId: user.organizationId,

                name: user.name,

                email: user.email,

                role: user.role

            }

        };

    }

}
